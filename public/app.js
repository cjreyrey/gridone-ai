const elements = {
  start: document.querySelector("#start-job"),
  reset: document.querySelector("#reset-demo"),
  workers: document.querySelector("#workers"),
  pipeline: document.querySelector("#pipeline"),
  events: document.querySelector("#events"),
  ledger: document.querySelector("#ledger"),
  jobStatus: document.querySelector("#job-status"),
  progress: document.querySelector("#pipeline-progress"),
  metrics: {
    workers: document.querySelector("#metric-workers"),
    verified: document.querySelector("#metric-verified"),
    credits: document.querySelector("#metric-credits"),
    rejected: document.querySelector("#metric-rejected")
  }
};

let latestState = null;
let hostedEngine = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function api(path, options = {}) {
  if (hostedEngine) return hostedEngine.request(path, options);
  try {
    const response = await fetch(path, {
      method: options.method || "GET",
      headers: { "content-type": "application/json" },
      body: options.body ? JSON.stringify(options.body) : undefined
    });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    return response.json();
  } catch (error) {
    const { HostedGridEngine } = await import("./hosted-engine.js");
    hostedEngine = new HostedGridEngine();
    document.querySelector(".network-pill").innerHTML = '<span class="pulse"></span> Hosted cooperative live';
    return hostedEngine.request(path, options);
  }
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function time(value) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function renderWorkers(workers) {
  if (!workers.length) {
    elements.workers.innerHTML = '<div class="empty-state">Start the demo workers to join the grid.</div>';
    return;
  }
  elements.workers.innerHTML = workers.map((worker) => `
    <div class="worker">
      <div class="worker-head">
        <span class="pulse"></span>
        <div><strong>${escapeHtml(worker.name)}</strong><small>${escapeHtml(worker.metrics.platform || "detecting hardware")}</small></div>
        <span class="worker-status ${escapeHtml(worker.status)}">${escapeHtml(worker.status)}</span>
      </div>
      <div class="worker-metrics">
        <div><span>CPU GUARD</span><b>${Math.round((worker.metrics.loadRatio || 0) * 100)}%</b></div>
        <div><span>FREE MEMORY</span><b>${formatNumber(worker.metrics.freeMemoryMb)} MB</b></div>
        <div><span>VERIFIED</span><b>${worker.verifiedTasks}</b></div>
      </div>
      <div class="worker-actions">
        <span>+${formatNumber(worker.credits)} AI CREDITS</span>
        <button class="mini-button" data-worker="${escapeHtml(worker.id)}" data-paused="${worker.paused}">${worker.paused ? "Resume" : "Pause contribution"}</button>
      </div>
    </div>
  `).join("");
}

function renderPipeline(tasks) {
  const verified = tasks.filter((task) => task.status === "verified").length;
  elements.progress.textContent = `${verified} / ${tasks.length} complete`;
  if (!tasks.length) {
    elements.pipeline.innerHTML = '<div class="empty-state">Start a job to create microtasks.</div>';
    return;
  }
  elements.pipeline.innerHTML = tasks.map((task) => `
    <div class="task ${escapeHtml(task.status)}">
      <b>${escapeHtml(task.id.split("_").slice(-2).join(" ").toUpperCase())}</b>
      <span>${escapeHtml(task.status.toUpperCase())}</span>
      <small>${task.payload.wordCount} words · try ${task.attempts}</small>
    </div>
  `).join("");
}

function renderEvents(events) {
  const visible = events.slice(0, 11);
  const latestRejection = events.find((event) => event.type === "result-rejected");
  if (latestRejection && !visible.some((event) => event.id === latestRejection.id)) visible.push(latestRejection);
  elements.events.innerHTML = visible.map((event) => `
    <div class="event ${escapeHtml(event.type)}">
      <span class="event-dot"></span>
      <p>${escapeHtml(event.message)}</p>
      <time>${time(event.at)}</time>
    </div>
  `).join("");
}

function renderLedger(ledger) {
  if (!ledger.length) {
    elements.ledger.innerHTML = '<div class="empty-state">Credits appear only after verification.</div>';
    return;
  }
  elements.ledger.innerHTML = ledger.slice(0, 9).map((receipt) => `
    <div class="receipt">
      <div><strong>${escapeHtml(receipt.receiptId)}</strong><p>${escapeHtml(receipt.workerName)} · ${escapeHtml(receipt.receiptHash.slice(0, 12))}…</p></div>
      <b>+${formatNumber(receipt.credits)}</b>
    </div>
  `).join("");
}

function render(state) {
  latestState = state;
  const online = state.workers.filter((worker) => worker.status !== "offline").length;
  elements.metrics.workers.textContent = online;
  elements.metrics.verified.textContent = state.stats.verifiedTasks;
  elements.metrics.credits.textContent = formatNumber(state.stats.totalCredits);
  elements.metrics.rejected.textContent = state.stats.rejectedResults;
  renderWorkers(state.workers);
  renderPipeline(state.tasks);
  renderEvents(state.events);
  renderLedger(state.ledger);

  const job = state.jobs.at(-1);
  elements.jobStatus.className = `status-chip ${job?.status || "idle"}`;
  elements.jobStatus.innerHTML = `<span></span>${job ? `Job ${escapeHtml(job.status)}` : "No job running"}`;
  elements.start.disabled = Boolean(job && job.status !== "completed");
  elements.start.querySelector("span").textContent = job?.status === "completed" ? "Run another job" : "Start verified job";
}

async function refresh() {
  try {
    render(await api("/api/state"));
  } catch (error) {
    elements.jobStatus.textContent = "Coordinator unavailable";
  }
}

elements.start.addEventListener("click", async () => {
  if (latestState?.jobs?.at(-1)?.status === "completed") await api("/api/reset", { method: "POST" });
  await api("/api/demo/start", { method: "POST" });
  await refresh();
});

elements.reset.addEventListener("click", async () => {
  await api("/api/reset", { method: "POST" });
  await refresh();
});

elements.workers.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-worker]");
  if (!button) return;
  await api(`/api/workers/${encodeURIComponent(button.dataset.worker)}/pause`, {
    method: "POST",
    body: { paused: button.dataset.paused !== "true" }
  });
  await refresh();
});

refresh();
setInterval(refresh, 650);

