# Build Week MVP

## Goal

Prove that two or more Builder workers can accept safe, bounded AI microtasks from a coordinator, return verifiable results, and receive transparent prototype AI Credits without disrupting the Builder experience.

## The one-sentence demo

**A job is divided, executed by real local workers, verified, and converted into visible AI Credits while the Builder remains in control.**

## Must be real

- At least two independently running worker processes.
- Worker registration and capability reporting.
- Smart Contribution policy with manual pause and at least two automatic conditions.
- Coordinator task assignment with lease, timeout, and retry.
- One allow-listed AI-relevant task type.
- Result verification, including redundant execution of a sample.
- Credit creation only after verification.
- Live dashboard updates or rapid polling.
- Task receipts and prototype credit history.
- Clear disclosure of simulation and non-goals.

## May be simulated, with labels

- Geographic locations of demo nodes.
- Large network totals.
- AI Credit redemption catalog.
- Integration with GPT, Codex, image, video, or API subscriptions.
- NPU and mobile-device availability.
- Production-grade energy estimates.

## Explicit non-goals

- Training or serving a frontier language model.
- Running arbitrary third-party code.
- Handling private or regulated data.
- Cryptocurrency, payments, or transferable tokens.
- Global peer-to-peer networking.
- Native clients for every operating system.
- Production security certification.
- Claiming data-center replacement or cost superiority.

## Suggested demo workload

Use a public-document processing pipeline that can be divided into chunks:

1. Submit a public or synthetic document bundle.
2. Split it into bounded chunks.
3. Workers generate embeddings or classify chunks with a fixed small model.
4. The verifier checks schema, model version, deterministic test vectors, and a redundant sample.
5. The coordinator aggregates results into a searchable index or summary input.

If model determinism is unreliable across hardware, use a deterministic preprocessing step plus reference-vector tolerance and make the limitation explicit.

## Acceptance criteria

- A new Builder reaches “available” in under three minutes.
- A submitted job visibly fans out to at least two workers.
- Pausing one worker stops new assignments and causes safe retry elsewhere.
- A tampered or incorrect result is rejected in the demo test.
- A valid result generates a linked credit receipt.
- The dashboard labels credits “Prototype / non-redeemable.”
- The full demo completes in under 90 seconds after setup.
- A fallback recording and deterministic demo dataset exist.

## Definition of done

- Reproducible setup instructions.
- One-command or one-click demo start where practical.
- Automated tests for task states, verification, and credit gating.
- Architecture and threat assumptions match the implementation.
- No secret keys or personal data in the repository.
- Demo video, Devpost text, and repository tell the same story.

## Success metric

At the end of the demo, a judge should understand three things without explanation:

1. Real work moved across multiple nodes.
2. The network verified work before rewarding it.
3. A Builder can participate without surrendering control of the device.

