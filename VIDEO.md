# GridOne AI Demo Video

## Recording target

- **Final duration:** 2:15–2:35; never exceed 2:55.
- **Format:** 16:9, 1080p, English narration, burned-in English captions.
- **Public host:** YouTube, set to Public or Unlisted and accessible without login.
- **Demo:** https://cjreyrey.github.io/gridone-ai/
- **Rule coverage:** working product, what was built, how Codex and GPT-5.6 were used, and honest prototype boundaries.

## Before recording

1. Close notifications, email, private tabs, bookmarks, and password-manager popups.
2. Open the public demo in a clean browser window at 100% zoom.
3. Confirm the dashboard says **Hosted cooperative live** and shows two Builders.
4. Select **Reset demo** so all metrics begin at zero.
5. Keep the GitHub repository ready in a second tab for the implementation shot.
6. Record one silent test and confirm that text remains readable at 1080p.
7. Use no copyrighted music. Clean voice narration is enough.

## Final storyboard and narration

### 0:00–0:12 — Hook

**Visual:** GridOne hero and tagline. Slowly move toward the live metrics.

**Narration:**

> AI infrastructure is becoming more powerful, expensive, and concentrated. Meanwhile, useful computing capacity sits idle in devices everywhere. GridOne asks: what if people could participate in AI infrastructure, not only consume it?

### 0:12–0:28 — Product promise

**Visual:** Show the tagline, two Builder nodes, and the disclosure beneath the buttons.

**Narration:**

> GridOne is a collaborative compute network. People become Builders by sharing capacity on their own terms. Suitable AI jobs become bounded microtasks, and only verified work earns transparent prototype AI Credits.

### 0:28–0:43 — Builder control

**Visual:** Scroll to the Builders panel. Point to CPU guard, free memory, and **Pause contribution**.

**Narration:**

> Builder control comes first. Smart Contribution protects foreground activity, shows resource limits, and lets either Builder pause instantly. The prototype never executes arbitrary remote code; it accepts one allow-listed task type using public or synthetic data.

### 0:43–1:10 — Start the job

**Visual:** Return to the top and select **Start verified job**. Follow the task tiles as Madrid and Berlin work. If comfortable, pause Madrid once while a task is active, then resume it.

**Narration:**

> I start one document-vector job. The coordinator splits it into eight microtasks and leases them to two isolated workers. Each worker produces a deterministic vector, input digest, and token count. A paused or failed lease returns safely to the queue.

### 1:10–1:32 — Verification, rejection, and retry

**Visual:** Show **INVALID RESULTS: 1**, task 02 with **try 2**, and the pinned red rejection event in the Trust Events panel.

**Narration:**

> Berlin deliberately tampers with its first answer. GridOne does not trust it. The verifier recomputes the expected result, rejects the mismatch, and requeues the task. The second attempt passes. This is the core trust boundary of the prototype.

### 1:32–1:49 — Verified reward

**Visual:** Show **8 of 8 complete**, the total AI Credits, both Builder balances, and several receipt hashes.

**Narration:**

> When all eight tasks are verified, credits appear. Every balance change links to a task receipt. These Build Week credits are intentionally non-redeemable; the demo proves accounting and verification, not a finished economy.

### 1:49–2:13 — What was built with Codex and GPT-5.6

**Visual:** Open the public GitHub repository. Briefly show README, `src`, `test`, and the passing-test section or terminal capture.

**Narration:**

> I used Codex and GPT-5.6 as a product and engineering partner throughout Build Week: pressure-testing the original cooperative idea, narrowing it to a credible workload, designing the coordinator and worker protocol, implementing the dashboard and verification logic, and writing the automated tests. Human judgment set the mission, product boundaries, and refusal to overclaim privacy, economics, or scale.

### 2:13–2:28 — Close

**Visual:** Return to the completed dashboard, then end on the tagline.

**Narration:**

> GridOne does not replace data centers. It demonstrates a community-powered layer for divisible, latency-tolerant, verifiable AI work. One grid, millions of Builders, a shared future. Don't just use AI. Help build it.

## Recording notes

- Read naturally; do not try to match every timestamp word for word.
- Leave the pointer still unless it is indicating a specific proof point.
- Cut dead time, but do not fake task state or reorder events misleadingly.
- Keep the **non-redeemable** and **hosted browser workers / desktop OS processes** disclosures visible when relevant.
- If the live interaction misfires, reset and record a new complete run rather than splicing incompatible states.

## YouTube text

**Title:** GridOne AI — Don't Just Use AI. Help Build It. | OpenAI Build Week

**Description:**

GridOne AI is a Build Week prototype for verifiable, community-powered AI microtasks. Builders contribute through isolated workers, invalid results are rejected and retried, and only verified work earns transparent prototype AI Credits.

Live demo: https://cjreyrey.github.io/gridone-ai/

Source code: https://github.com/cjreyrey/gridone-ai

Prototype credits are simulated and non-redeemable. GridOne demonstrates a complementary compute layer; it does not claim to replace data centers or train frontier models over consumer internet connections.

