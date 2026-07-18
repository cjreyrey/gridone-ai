import os from "node:os";
import { vectorize } from "./core.js";

function argument(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

const id = argument("id", `worker-${process.pid}`);
const name = argument("name", id);
const coordinator = argument("coordinator", process.env.GRIDONE_COORDINATOR || "http://127.0.0.1:8787");
const tamperOnceEnabled = process.argv.includes("--tamper-once");
const executionDelay = Number(argument("delay", "900"));
let tamperRemaining = tamperOnceEnabled;
let running = true;
let busy = false;

const policy = {
  maxLoadRatio: Number(argument("max-load", "0.95")),
  minFreeMemoryMb: Number(argument("min-memory", "128")),
  onlyWhilePluggedIn: false,
  foregroundAlwaysWins: true
};

function metrics() {
  const cpuCount = Math.max(1, os.cpus().length);
  const loadRatio = os.loadavg()[0] / cpuCount;
  return {
    cpuCount,
    loadRatio: Number(loadRatio.toFixed(3)),
    freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
    totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
    platform: `${os.platform()} ${os.arch()}`,
    processId: process.pid
  };
}

function available(current) {
  return current.loadRatio <= policy.maxLoadRatio && current.freeMemoryMb >= policy.minFreeMemoryMb;
}

async function request(path, options = {}) {
  const response = await fetch(`${coordinator}${path}`, {
    method: options.method || "GET",
    headers: { "content-type": "application/json" },
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const payload = await response.json();
  if (!response.ok && response.status !== 422) throw new Error(`${response.status}: ${JSON.stringify(payload)}`);
  return payload;
}

async function register() {
  const current = metrics();
  await request("/api/workers/register", {
    method: "POST",
    body: {
      id,
      name,
      capabilities: { taskTypes: ["document_vector_v1"], vectorDimensions: 16 },
      policy,
      metrics: current
    }
  });
  console.log(`${name} registered with ${coordinator}`);
}

async function work(task) {
  busy = true;
  console.log(`${name} executing ${task.id} (attempt ${task.attempts})`);
  await new Promise((resolve) => setTimeout(resolve, executionDelay));
  const result = vectorize(task.payload.text);

  if (tamperRemaining) {
    result.vector[0] = Number((result.vector[0] + 0.25).toFixed(8));
    tamperRemaining = false;
    console.log(`${name} intentionally submitted one tampered result for the verification demo`);
  }

  const outcome = await request(`/api/tasks/${encodeURIComponent(task.id)}/result`, {
    method: "POST",
    body: { workerId: id, result }
  });
  console.log(`${name}: ${outcome.verified ? `verified +${outcome.credits} credits` : outcome.reason}`);
  busy = false;
}

async function cycle() {
  if (!running) return;
  try {
    const current = metrics();
    const canWork = available(current);
    await request(`/api/workers/${encodeURIComponent(id)}/heartbeat`, {
      method: "POST",
      body: { available: canWork, metrics: current }
    });

    if (!busy && canWork) {
      const { task } = await request(`/api/workers/${encodeURIComponent(id)}/lease`, { method: "POST" });
      if (task) await work(task);
    }
  } catch (error) {
    console.error(`${name}: ${error.message}`);
    busy = false;
  } finally {
    if (running) setTimeout(cycle, busy ? 100 : 350);
  }
}

async function main() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      await register();
      return cycle();
    } catch (error) {
      if (attempt === 29) throw error;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    running = false;
    process.exit(0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

