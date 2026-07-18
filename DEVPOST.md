# Devpost Submission Draft

> This is a living draft. Confirm the current Build Week requirements before final submission and remove every placeholder.

## Project name

GridOne AI

## Tagline

Don't just use AI. Help build it.

## Elevator pitch

GridOne AI lets people safely contribute idle device capacity to verifiable AI microtasks and earn prototype AI Credits—turning passive AI users into active Builders.

## Inspiration

AI infrastructure is expensive and increasingly concentrated. Meanwhile, billions of personal devices contain capacity that often sits idle. We wanted to explore a more participatory model: not AI built only for humanity, but AI infrastructure built with humanity.

GridOne begins with a simple emotional promise: **people should be able to say, “I helped build this.”**

## What it does

GridOne coordinates suitable AI work across opt-in Builder devices.

Builders set contribution limits through Smart Contribution. The coordinator divides a supported job into bounded, allow-listed microtasks and assigns them to available workers. Results remain untrusted until task-specific checks and selective redundant execution verify them. Only verified tasks create prototype AI Credits, and every credit links to a receipt.

Our Build Week prototype demonstrates this loop with multiple real worker processes, pause and reassignment, verification, a rejected invalid result, and a live Builder dashboard.

## How we built it

The prototype consists of:

- A Builder dashboard for controls, status, receipts, and prototype credits.
- A coordinator API and task state machine.
- A scheduler with leases, timeouts, retry, and policy matching.
- Worker processes that accept only versioned, allow-listed task types.
- A verifier using task-specific checks and redundant sampling.
- An append-only prototype credit ledger gated by verified completion.

**Final implementation stack:** [replace after architecture decision]

## Challenges we ran into

- Identifying AI workloads that are both meaningfully distributed and realistically verifiable.
- Treating unknown workers as untrusted without making redundancy erase the economic value.
- Designing contribution controls that preserve Builder trust and foreground performance.
- Explaining an ambitious long-term vision while making the prototype's limits unmistakable.
- Separating transport encryption and task splitting from stronger privacy guarantees.

## Accomplishments that we're proud of

- [Replace with verified implementation accomplishments only.]
- A complete contribution-to-verification-to-credit loop.
- Builder-first control and transparent task receipts.
- Honest product boundaries: no arbitrary code, no sensitive demo data, and no claim that prototype credits are redeemable.

## What we learned

- Distributed compute is not automatically cheaper, greener, private, or trustworthy; each claim requires workload-specific measurement.
- Verification is part of the product and the economics.
- The strongest experience is not a hardware dashboard. It is the feeling of purposeful participation with visible control.
- A credible community compute layer complements data centers instead of pretending they are unnecessary.

## What's next

- Pilot with 25–100 opt-in Builders.
- Measure useful work, redundant work, energy, failure, and trust.
- Add stronger isolation, reputation, and task classification.
- Test a developer quickstart and a second workload class.
- Explore partnerships that could make AI Credits genuinely useful and sustainable.
- Investigate cooperative governance so Builders have a voice in the network they power.

## Built with OpenAI

[Document the OpenAI models, APIs, and Codex workflows actually used. Do not list planned or unused products. Include concrete examples and repository evidence where appropriate.]

## Links

- Repository: [add URL]
- Demo: [add URL]
- Video: [add URL]
- Live app: [add URL if applicable]

## Accuracy disclosures

- Build Week AI Credits are simulated and non-redeemable.
- Example locations may be labels for local worker processes.
- The demo uses public or synthetic data.
- GridOne does not currently integrate with or imply endorsement by third-party AI services.
- The prototype demonstrates a task class, not universal distributed AI compute.

## Final submission checklist

- [ ] Re-read current official rules and required fields.
- [ ] Replace every bracketed placeholder.
- [ ] Confirm project and team eligibility.
- [ ] Confirm repository visibility and license decision.
- [ ] Test setup instructions from a clean environment.
- [ ] Verify video duration, format, captions, and public access.
- [ ] Add screenshots, diagram, logo, and thumbnail.
- [ ] Match technical claims to the shipped code.
- [ ] Describe actual Codex and OpenAI usage.
- [ ] Remove secrets, personal data, and unlicensed assets.
- [ ] Confirm all links work without private access.
- [ ] Obtain team approval before final submission.

