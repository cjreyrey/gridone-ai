import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 9200 + (process.pid % 400);
const base = `http://127.0.0.1:${port}`;

function launch(file, args = [], env = {}) {
  return spawn(process.execPath, [file, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: "ignore"
  });
}

async function waitFor(check, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await check();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
  throw lastError || new Error("Timed out waiting for condition");
}

async function get(path) {
  const response = await fetch(`${base}${path}`);
  assert.equal(response.ok, true);
  return response.json();
}

async function post(path, body = {}) {
  const response = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  assert.equal(response.ok, true);
  return response.json();
}

test("two workers complete a job, reject tampering, and earn verified credits", { timeout: 25_000 }, async (t) => {
  const processes = [
    launch("src/server.js", [], { PORT: String(port) }),
    launch("src/worker.js", ["--id", "test-madrid", "--name", "Test-Madrid", "--coordinator", base, "--delay", "80"]),
    launch("src/worker.js", ["--id", "test-berlin", "--name", "Test-Berlin", "--coordinator", base, "--delay", "80", "--tamper-once"])
  ];

  t.after(() => processes.forEach((process) => process.kill("SIGTERM")));

  await waitFor(async () => (await get("/api/health")).ok);
  await waitFor(async () => (await get("/api/state")).workers.length === 2);
  await post("/api/demo/start");

  const state = await waitFor(async () => {
    const current = await get("/api/state");
    return current.jobs[0]?.status === "completed" && current.stats.rejectedResults >= 1
      ? current
      : null;
  });

  assert.equal(state.workers.length, 2);
  assert.equal(state.tasks.every((task) => task.status === "verified"), true);
  assert.equal(state.ledger.length, state.tasks.length);
  assert.equal(state.stats.verifiedTasks, state.tasks.length);
  assert.ok(state.stats.totalCredits > 0);
  assert.ok(state.workers.every((worker) => worker.verifiedTasks > 0));
  assert.equal(state.creditsRedeemable, false);
});

