# Product

## Product promise

**Contribute safely. See your impact. Unlock intelligence.**

GridOne turns participation into a clear exchange: Builders choose when and how their devices contribute; the network assigns safe tasks; verified work earns transparent AI Credits.

## Primary Build Week persona

### The Builder

An AI enthusiast or developer with a desktop or laptop who understands the idea of idle capacity but needs strong reasons to trust the software.

Needs:

- A setup that takes less than three minutes.
- Explicit limits for CPU/GPU, schedule, power, heat, and network use.
- A clear pause/stop control.
- Proof that only approved tasks run.
- A contribution history and understandable credit calculation.
- Honest labels for simulated versus redeemable value.

## Secondary persona

### The Workload Developer

A developer with a bounded asynchronous AI task who wants simple submission, observable execution, verifiable results, and predictable accounting.

The MVP shows this persona through a small task-submission console or scripted request; it does not build a complete developer platform.

## Builder journey

1. **Discover** — “Don't just use AI. Help build it.”
2. **Understand** — Learn what the worker can and cannot access.
3. **Choose** — Set contribution limits and an operating schedule.
4. **Connect** — Device health and capability are registered.
5. **Contribute** — Receive and execute an allow-listed microtask.
6. **Verify** — See that the result passed validation.
7. **Earn** — Receive simulated AI Credits with a calculation breakdown.
8. **Reflect** — See tasks completed, active time, estimated energy, and community impact.
9. **Control** — Pause instantly, change limits, or leave the network.

## Core surfaces

### 1. Welcome and trust

- Mission and concise explanation.
- “What GridOne can access” and “What GridOne never accesses.”
- Clear prototype disclosure.
- Primary action: **Become a Builder**.

### 2. Smart Contribution controls

- Contribution on/off.
- CPU/GPU limit.
- Only while plugged in.
- Pause on battery, high temperature, high foreground load, or metered network.
- Schedule window.
- Estimated energy and credit range.

### 3. Live contribution

- Device state: available, working, verifying, paused.
- Current task type and safe description.
- Resource usage.
- Progress and verification status.
- One-click pause.

### 4. Builder dashboard

```text
TODAY YOU HELPED BUILD AI

3 verified tasks        37 min active
2 collaborating nodes   ~0.08 kWh estimated

AI Credits earned
1,248 (prototype)
```

### 5. Unlock Intelligence

The vision includes GPT, Codex, research, education, image/video generation, and APIs. In the MVP this is a clearly labeled catalog preview; credits are not redeemable and no third-party partnership is implied.

## Smart Contribution

Smart Contribution is a policy engine, not a claim that GridOne can perfectly detect “unused” resources.

For the MVP, a worker accepts work only when configured conditions are true. It checks a small set of signals, applies conservative limits, and yields immediately when the Builder pauses or foreground load rises.

## AI Credits

### MVP accounting

Credits are simulated units computed from verified task completion and measured resource time. A simple, visible formula is preferable to a sophisticated but opaque one.

```text
credits = verified_work_units × task_weight × reliability_multiplier
```

Resource telemetry explains the contribution but does not independently mint credits. This reduces incentives to fake CPU time or memory allocation.

### Design requirements

- Credits appear only after verification.
- Every entry links to a task receipt.
- Failed or canceled tasks are explained.
- “Prototype / non-redeemable” appears wherever balances are shown.
- Future redemption examples are labeled as vision, not availability.

## Trust copy

- **You are in control.** Pause or stop at any time.
- **Only approved tasks run.** The MVP never executes arbitrary remote code.
- **Your files stay yours.** The demo worker does not scan personal files.
- **Contribution is visible.** Every task produces a receipt.
- **Credits are experimental.** Build Week credits have no cash value and cannot yet buy third-party services.

## Product metrics

- Setup completion rate and time.
- Percentage of Builders who start a first task.
- Task success and verification rate.
- Foreground-interruption events.
- Builder pause/exit rate.
- Useful work per total work, including redundancy.
- Trust score before and after the first contribution.
- Willingness to run again overnight.

