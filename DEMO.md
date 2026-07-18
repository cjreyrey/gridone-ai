# Demo Storyboard

## Demo objective

Make the collaborative loop visible in 90 seconds: **control → contribution → verification → reward**.

## Run it

```bash
npm run demo
```

Then open `http://127.0.0.1:8787`. No dependency installation or API key is required beyond Node.js 20+.

Berlin-Builder is configured with `--tamper-once`, providing a real rejected-result event. During the live job, pause Madrid-Builder while it is working to demonstrate lease requeue and reassignment.

## Before recording

- Start the coordinator, dashboard, and two named workers: Madrid and Berlin (labels are simulated locations unless machines are truly remote).
- Use a fixed public or synthetic input bundle.
- Reset the prototype ledger to a known balance.
- Confirm Worker B is ready to demonstrate pause/retry.
- Hide personal notifications, paths, account details, and secrets.
- Record a clean fallback run.

## 90-second storyboard

### 0–10 seconds — Hook

Visual: GridOne welcome screen.

Narration:

> AI depends on increasingly expensive infrastructure, while useful capacity sits idle in devices everywhere. GridOne asks a simple question: what if people could help power AI—and earn access to it?

### 10–22 seconds — Become a Builder

Visual: Smart Contribution controls.

Action: Enable contribution with a conservative limit and “only while plugged in.”

Narration:

> GridOne calls participants Builders. They choose the limits. Foreground use always wins, and they can pause instantly.

### 22–38 seconds — Submit and divide

Visual: Submit a public-document job; task graph appears.

Narration:

> A developer submits a bounded AI job. The coordinator divides it into allow-listed microtasks and matches them to available devices.

### 38–55 seconds — Real distributed work

Visual: Madrid and Berlin process different tasks.

Action: Pause Berlin; its lease returns and Madrid or a third worker receives the retry.

Narration:

> These are real worker processes. When one Builder pauses, GridOne safely reassigns the work without taking control away from the person.

### 55–70 seconds — Verify

Visual: One redundant sample agrees; a prepared tampered result is rejected.

Narration:

> Unknown devices are never trusted blindly. Results are checked by task-specific rules and selective redundancy before they count.

### 70–84 seconds — Earn

Visual: Receipt changes to verified; balance increases.

Narration:

> Only verified work earns prototype AI Credits. Every credit links back to a transparent receipt.

### 84–90 seconds — Vision

Visual: Community network and tagline.

Narration:

> GridOne doesn't replace data centers. It adds a collaborative layer—and lets humanity participate. Don't just use AI. Help build it.

## Proof points to keep on screen

- Two distinct worker identifiers.
- Task IDs and state transitions.
- Pause and retry event.
- Verification status.
- Credit receipt linked to verified task.
- “Prototype / non-redeemable” credit label.

## Failure plan

- Keep the live demo small and deterministic.
- Have a local-only network mode if external deployment is unavailable.
- Keep a pre-recorded uncut run as fallback.
- Preserve logs that demonstrate separate worker processes.
- If a feature is simulated, say so on screen and in narration.

## Assets needed

- Product logo and monochrome mark.
- One architecture diagram.
- Welcome, controls, live contribution, verification, and dashboard screenshots.
- 16:9 title and closing cards.
- Caption file and thumbnail.
