const DIMENSIONS = 16;
let tamperRemaining = false;

function tokenize(text) {
  return String(text).toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/).filter((token) => token.length > 1);
}

function bucket(token) {
  let hash = 2166136261;
  for (const character of token) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return (hash >>> 0) % DIMENSIONS;
}

async function digest(text) {
  const bytes = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text))));
  return [...bytes].map((value) => value.toString(16).padStart(2, "0")).join("");
}

async function vectorize(text) {
  const tokens = tokenize(text);
  const vector = Array.from({ length: DIMENSIONS }, () => 0);
  for (const token of tokens) vector[bucket(token)] += 1;
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return {
    vector: (magnitude === 0 ? vector : vector.map((value) => value / magnitude)).map((value) => Number(value.toFixed(8))),
    tokenCount: tokens.length,
    digest: await digest(text)
  };
}

self.addEventListener("message", async ({ data }) => {
  if (data.type === "configure") { tamperRemaining = Boolean(data.tamperOnce); return; }
  if (data.type !== "execute") return;
  await new Promise((resolve) => setTimeout(resolve, data.delay || 850));
  const result = await vectorize(data.task.payload.text);
  if (tamperRemaining) {
    result.vector[0] = Number((result.vector[0] + 0.25).toFixed(8));
    tamperRemaining = false;
  }
  self.postMessage({ type: "result", workerId: data.workerId, taskId: data.task.id, result });
});

