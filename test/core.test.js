import test from "node:test";
import assert from "node:assert/strict";
import {
  TASK_TYPE,
  VECTOR_DIMENSIONS,
  calculateCredits,
  splitText,
  vectorize,
  verifyTaskResult
} from "../src/core.js";

test("vectorization is deterministic and normalized", () => {
  const first = vectorize("Builders securely contribute idle compute for AI.");
  const second = vectorize("Builders securely contribute idle compute for AI.");
  assert.deepEqual(first, second);
  assert.equal(first.vector.length, VECTOR_DIMENSIONS);
  const magnitude = Math.sqrt(first.vector.reduce((sum, value) => sum + value * value, 0));
  assert.ok(Math.abs(magnitude - 1) < 1e-6);
});

test("verification rejects a tampered vector", () => {
  const task = {
    id: "task_1",
    jobId: "job_1",
    type: TASK_TYPE,
    attempts: 1,
    payload: { text: "Verifiable work earns transparent credits." }
  };
  const valid = vectorize(task.payload.text);
  assert.equal(verifyTaskResult(task, valid).valid, true);
  valid.vector[0] += 0.5;
  assert.deepEqual(verifyTaskResult(task, valid), {
    valid: false,
    reason: "vector-verification-failed"
  });
});

test("credits are derived from verified useful work", () => {
  const task = { attempts: 2 };
  const credits = calculateCredits(task, { tokenCount: 12 });
  assert.equal(credits, 152);
});

test("document splitting produces bounded non-empty chunks", () => {
  const chunks = splitText("one two three four five six seven eight nine", 3);
  assert.deepEqual(chunks, ["one two three", "four five six", "seven eight nine"]);
});

