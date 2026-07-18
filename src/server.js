import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { GridState } from "./state.js";
import { DEMO_DOCUMENT } from "./sample-data.js";

const root = fileURLToPath(new URL("../", import.meta.url));
const publicRoot = join(root, "public");
const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "127.0.0.1";
const grid = new GridState();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon"
};

function json(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "GET,POST,OPTIONS"
  });
  response.end(JSON.stringify(body));
}

async function body(request) {
  const parts = [];
  for await (const part of request) parts.push(part);
  if (!parts.length) return {};
  return JSON.parse(Buffer.concat(parts).toString("utf8"));
}

async function api(request, response, url) {
  if (request.method === "OPTIONS") return json(response, 204, {});
  if (request.method === "GET" && url.pathname === "/api/health") {
    return json(response, 200, { ok: true, service: "gridone-coordinator" });
  }
  if (request.method === "GET" && url.pathname === "/api/state") {
    return json(response, 200, grid.snapshot());
  }
  if (request.method === "POST" && url.pathname === "/api/reset") {
    grid.reset();
    return json(response, 200, grid.snapshot());
  }
  if (request.method === "POST" && url.pathname === "/api/demo/start") {
    const running = [...grid.jobs.values()].find((job) => job.status !== "completed");
    const job = running || grid.createJob(DEMO_DOCUMENT);
    return json(response, 201, { job, state: grid.snapshot() });
  }
  if (request.method === "POST" && url.pathname === "/api/workers/register") {
    const worker = grid.registerWorker(await body(request));
    return json(response, 201, { worker });
  }

  const heartbeatMatch = url.pathname.match(/^\/api\/workers\/([^/]+)\/heartbeat$/);
  if (request.method === "POST" && heartbeatMatch) {
    const worker = grid.heartbeat(decodeURIComponent(heartbeatMatch[1]), await body(request));
    return worker ? json(response, 200, { worker }) : json(response, 404, { error: "worker-not-found" });
  }

  const leaseMatch = url.pathname.match(/^\/api\/workers\/([^/]+)\/lease$/);
  if (request.method === "POST" && leaseMatch) {
    const task = grid.leaseTask(decodeURIComponent(leaseMatch[1]));
    return json(response, 200, { task });
  }

  const pauseMatch = url.pathname.match(/^\/api\/workers\/([^/]+)\/pause$/);
  if (request.method === "POST" && pauseMatch) {
    const worker = grid.setWorkerPaused(decodeURIComponent(pauseMatch[1]), (await body(request)).paused);
    return worker ? json(response, 200, { worker }) : json(response, 404, { error: "worker-not-found" });
  }

  const resultMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/result$/);
  if (request.method === "POST" && resultMatch) {
    const input = await body(request);
    const outcome = grid.submitResult(input.workerId, decodeURIComponent(resultMatch[1]), input.result);
    return json(response, outcome.accepted ? 200 : 422, outcome);
  }

  return json(response, 404, { error: "not-found" });
}

async function staticFile(response, pathname) {
  const requested = pathname === "/" ? "index.html" : pathname.slice(1);
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const fullPath = join(publicRoot, safePath);
  if (!fullPath.startsWith(publicRoot)) {
    response.writeHead(403);
    return response.end("Forbidden");
  }

  try {
    const content = await readFile(fullPath);
    response.writeHead(200, {
      "content-type": mimeTypes[extname(fullPath)] || "application/octet-stream",
      "cache-control": "no-cache"
    });
    response.end(content);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

export const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);
    if (url.pathname.startsWith("/api/")) return await api(request, response, url);
    return await staticFile(response, url.pathname);
  } catch (error) {
    console.error(error);
    return json(response, 500, { error: "internal-error" });
  }
});

const sweepTimer = setInterval(() => grid.sweep(), 1_000);
sweepTimer.unref();

server.listen(port, host, () => {
  console.log(`GridOne coordinator listening at http://${host}:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}

