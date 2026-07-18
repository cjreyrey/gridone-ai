import { spawn } from "node:child_process";

const coordinator = process.env.GRIDONE_COORDINATOR || "http://127.0.0.1:8787";
const port = new URL(coordinator).port || "8787";
const children = [];

function launch(label, file, args = [], env = {}) {
  const child = spawn(process.execPath, [file, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stdout.on("data", (data) => process.stdout.write(`[${label}] ${data}`));
  child.stderr.on("data", (data) => process.stderr.write(`[${label}] ${data}`));
  children.push(child);
  return child;
}

launch("coordinator", "src/server.js", [], { PORT: port });
launch("madrid", "src/worker.js", ["--id", "madrid", "--name", "Madrid-Builder", "--coordinator", coordinator]);
launch("berlin", "src/worker.js", [
  "--id",
  "berlin",
  "--name",
  "Berlin-Builder",
  "--coordinator",
  coordinator,
  "--tamper-once"
]);

console.log(`\nGridOne demo starting at ${coordinator}`);
console.log("Open the URL, then click “Start verified job”. Press Ctrl+C to stop.\n");

function stop() {
  for (const child of children) child.kill("SIGTERM");
  setTimeout(() => process.exit(0), 200).unref();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

