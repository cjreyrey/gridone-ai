const DOCUMENT = `GridOne AI is a collaborative intelligence network designed to let ordinary people participate in AI infrastructure. Builders choose when and how their computers contribute idle capacity. Smart Contribution keeps foreground activity in control and pauses work when device conditions cross the Builder limits. The coordinator divides public or synthetic documents into bounded microtasks. Independent workers transform each chunk into a deterministic feature-hash vector. Results are never trusted merely because a worker returned them. The verifier recomputes the expected receipt, checks the input digest, token count, vector dimensions, and numerical values, then rejects or accepts the result. Only verified work creates prototype AI Credits. Every credit entry links to a receipt that identifies the task, worker, input digest, useful work units, and verification time. Prototype credits are explicitly non-redeemable and have no cash value. The Build Week demonstration uses isolated workers, synthetic content, automatic task leases, retry after a Builder pauses, and one intentionally tampered result so judges can see that invalid work is rejected. GridOne does not claim to replace data centers or train frontier models over consumer internet connections. It demonstrates a smaller and more credible idea: a community-powered layer for divisible, latency-tolerant, independently verifiable AI workloads. Developers gain another way to execute supported batch tasks. Builders gain agency, transparency, and a visible record of their contribution. The long-term vision is an AI compute cooperative in which value flows back to the people who help create it. Don't just use AI. Help build it.`;
const DIMENSIONS = 16;
function now() { return new Date().toISOString(); }
function tokenize(text) { return String(text).toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((token) => token.length > 1); }
function bucket(token) { let hash = 2166136261; for (const character of token) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0) % DIMENSIONS; }
async function digest(text) { const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text)))); return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join(""); }
async function vectorize(text) {
  const tokens = tokenize(text); const vector = Array.from({ length: DIMENSIONS }, () => 0);
  for (const token of tokens) vector[bucket(token)] += 1;
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return { vector: (magnitude === 0 ? vector : vector.map((value) => value / magnitude)).map((value) => Number(value.toFixed(8))), tokenCount: tokens.length, digest: await digest(text) };
}
function splitText(text, size = 34) { const words = String(text).trim().split(/\s+/).filter(Boolean); const chunks = []; for (let index = 0; index < words.length; index += size) chunks.push(words.slice(index, index + size).join(" ")); return chunks; }

export class HostedGridEngine {
  constructor() { this.workers = []; this.reset(); }
  log(type, message) { this.events.unshift({ id: ++this.sequence, type, message, at: now() }); this.events = this.events.slice(0, 60); }
  reset() {
    for (const worker of this.workers) worker.runtime?.terminate();
    this.sequence = 0; this.jobs = []; this.tasks = []; this.ledger = []; this.events = [];
    this.stats = { rejectedResults: 0, requeuedTasks: 0, verifiedTasks: 0, totalCredits: 0 };
    this.workers = [this.makeWorker("madrid", "Madrid Builder", false, 0.11, 6144), this.makeWorker("berlin", "Berlin Builder", true, 0.08, 8192)];
    this.log("network-reset", "Hosted coordinator is ready with two isolated browser workers.");
    return this.snapshot();
  }
  makeWorker(id, name, tamperOnce, loadRatio, freeMemoryMb) {
    const runtime = new Worker(new URL("./browser-worker.js", import.meta.url), { type: "module", name });
    const worker = { id, name, status: "available", paused: false, activeTaskId: null, verifiedTasks: 0, rejectedTasks: 0, credits: 0, metrics: { platform: "isolated browser worker", loadRatio, freeMemoryMb }, runtime };
    runtime.postMessage({ type: "configure", tamperOnce });
    runtime.addEventListener("message", ({ data }) => this.receive(data));
    this.log("worker-online", `${name} joined the hosted grid.`); return worker;
  }
  start() {
    if (this.jobs.some((job) => job.status !== "completed")) return this.snapshot();
    const id = `job_${String(this.jobs.length + 1).padStart(3, "0")}`; const chunks = splitText(DOCUMENT);
    this.tasks = chunks.map((text, index) => ({ id: `${id}_task_${String(index + 1).padStart(2, "0")}`, jobId: id, payload: { text, chunkIndex: index, wordCount: text.split(/\s+/).length }, status: "queued", attempts: 0, leaseWorkerId: null }));
    this.jobs.push({ id, title: "GridOne public-document vector job", status: "queued", createdAt: now() });
    this.log("job-created", `Public document split into ${chunks.length} verifiable microtasks.`); this.schedule(); return this.snapshot();
  }
  schedule() {
    for (const worker of this.workers) {
      if (worker.paused || worker.activeTaskId) continue;
      const task = this.tasks.find((item) => item.status === "queued"); if (!task) continue;
      task.status = "leased"; task.attempts += 1; task.leaseWorkerId = worker.id; worker.activeTaskId = task.id; worker.status = "working"; this.jobs.at(-1).status = "running";
      this.log("task-leased", `${task.id} assigned to ${worker.name}.`); worker.runtime.postMessage({ type: "execute", workerId: worker.id, task, delay: 700 + Math.random() * 500 });
    }
  }
  async receive({ workerId, taskId, result }) {
    const worker = this.workers.find((item) => item.id === workerId); const task = this.tasks.find((item) => item.id === taskId);
    if (!worker || !task || task.status !== "leased" || task.leaseWorkerId !== workerId) return;
    worker.activeTaskId = null; worker.status = worker.paused ? "paused" : "available";
    const expected = await vectorize(task.payload.text);
    const valid = expected.digest === result.digest && expected.tokenCount === result.tokenCount && expected.vector.every((value, index) => Math.abs(value - Number(result.vector[index])) <= 1e-7);
    if (!valid) {
      task.status = "queued"; task.leaseWorkerId = null; worker.rejectedTasks += 1; this.stats.rejectedResults += 1; this.stats.requeuedTasks += 1;
      this.log("result-rejected", `${worker.name}'s result was rejected and safely requeued.`);
    } else {
      const credits = 100 + Math.max(1, result.tokenCount) * 4 + task.attempts * 2;
      const receipt = { receiptId: `receipt_${task.id}`, taskId: task.id, workerId: worker.id, workerName: worker.name, credits, receiptHash: await digest(`${task.id}:${worker.id}:${result.digest}:${credits}:${now()}`), verifiedAt: now(), prototype: true, redeemable: false };
      task.status = "verified"; task.leaseWorkerId = null; worker.verifiedTasks += 1; worker.credits += credits; this.ledger.unshift(receipt); this.stats.verifiedTasks += 1; this.stats.totalCredits += credits;
      this.log("result-verified", `${task.id} verified. ${worker.name} earned ${credits} AI Credits.`);
    }
    if (this.tasks.length && this.tasks.every((item) => item.status === "verified")) { this.jobs.at(-1).status = "completed"; this.jobs.at(-1).completedAt = now(); this.log("job-completed", `The job completed with ${this.tasks.length} verified tasks.`); }
    else setTimeout(() => this.schedule(), 120);
  }
  pause(workerId, paused) {
    const worker = this.workers.find((item) => item.id === workerId); if (!worker) return this.snapshot(); worker.paused = Boolean(paused);
    if (worker.paused && worker.activeTaskId) { const task = this.tasks.find((item) => item.id === worker.activeTaskId); if (task?.status === "leased") { task.status = "queued"; task.leaseWorkerId = null; this.stats.requeuedTasks += 1; this.log("task-requeued", `${task.id} requeued: Builder paused.`); } worker.activeTaskId = null; }
    worker.status = worker.paused ? "paused" : "available"; this.log(worker.paused ? "worker-paused" : "worker-resumed", `${worker.name} ${worker.paused ? "paused" : "resumed"} contribution.`); this.schedule(); return this.snapshot();
  }
  snapshot() { return { prototype: true, creditsRedeemable: false, mode: "hosted-browser-workers", workers: this.workers.map(({ runtime, ...worker }) => ({ ...worker })), jobs: this.jobs.map((job) => ({ ...job })), tasks: this.tasks.map((task) => ({ ...task, payload: { chunkIndex: task.payload.chunkIndex, wordCount: task.payload.wordCount } })), ledger: this.ledger.slice(0, 20), events: this.events.slice(0, 30), stats: { ...this.stats } }; }
  request(path, options = {}) {
    if (path === "/api/state") return this.snapshot();
    if (path === "/api/reset" && options.method === "POST") return this.reset();
    if (path === "/api/demo/start" && options.method === "POST") return this.start();
    const match = path.match(/^\/api\/workers\/([^/]+)\/pause$/); if (match && options.method === "POST") return this.pause(decodeURIComponent(match[1]), options.body?.paused);
    throw new Error(`Unsupported hosted operation: ${path}`);
  }
}

