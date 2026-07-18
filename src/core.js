import { createHash } from "node:crypto";

export const TASK_TYPE = "document_vector_v1";
export const VECTOR_DIMENSIONS = 16;

export function tokenize(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function tokenBucket(token, dimensions) {
  const digest = createHash("sha256").update(token).digest();
  return digest.readUInt32BE(0) % dimensions;
}

export function vectorize(text, dimensions = VECTOR_DIMENSIONS) {
  const tokens = tokenize(text);
  const vector = Array.from({ length: dimensions }, () => 0);

  for (const token of tokens) {
    vector[tokenBucket(token, dimensions)] += 1;
  }

  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  const normalized = magnitude === 0 ? vector : vector.map((value) => value / magnitude);

  return {
    vector: normalized.map((value) => Number(value.toFixed(8))),
    tokenCount: tokens.length,
    digest: createHash("sha256").update(String(text)).digest("hex")
  };
}

export function verifyTaskResult(task, result, tolerance = 1e-7) {
  if (!result || !Array.isArray(result.vector) || result.vector.length !== VECTOR_DIMENSIONS) {
    return { valid: false, reason: "invalid-result-shape" };
  }

  const expected = vectorize(task.payload.text);
  if (expected.digest !== result.digest || expected.tokenCount !== result.tokenCount) {
    return { valid: false, reason: "receipt-mismatch" };
  }

  const valid = expected.vector.every(
    (value, index) => Math.abs(value - Number(result.vector[index])) <= tolerance
  );

  return valid
    ? { valid: true, expected }
    : { valid: false, reason: "vector-verification-failed" };
}

export function calculateCredits(task, result) {
  const usefulUnits = Math.max(1, result.tokenCount);
  return 100 + usefulUnits * 4 + task.attempts * 2;
}

export function splitText(text, targetWords = 34) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const chunks = [];

  for (let index = 0; index < words.length; index += targetWords) {
    chunks.push(words.slice(index, index + targetWords).join(" "));
  }

  return chunks.filter(Boolean);
}

export function createReceipt({ task, worker, result, credits }) {
  const receipt = {
    receiptId: `receipt_${task.id}`,
    taskId: task.id,
    jobId: task.jobId,
    workerId: worker.id,
    workerName: worker.name,
    taskType: task.type,
    inputDigest: result.digest,
    tokenCount: result.tokenCount,
    credits,
    verifiedAt: new Date().toISOString(),
    prototype: true,
    redeemable: false
  };

  return {
    ...receipt,
    receiptHash: createHash("sha256").update(JSON.stringify(receipt)).digest("hex")
  };
}

export function cosineSimilarity(left, right) {
  if (left.length !== right.length) throw new Error("Vector dimensions must match");
  return left.reduce((sum, value, index) => sum + value * right[index], 0);
}

