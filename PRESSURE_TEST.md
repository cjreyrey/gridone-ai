# Pressure Test

This document is intentionally skeptical. GridOne should earn belief through tests, not rhetoric.

## Why would an AI provider use GridOne?

### Potential value

- Extend existing infrastructure with community capacity for suitable batch and edge-friendly workloads.
- Exchange useful AI access for verified contributions, creating a participation-and-adoption flywheel.
- Build a closer relationship with a worldwide community: people help power part of the ecosystem rather than only consuming it.
- Experiment with geographic reach, heterogeneous hardware, and resilient task distribution.

### Strong positioning

GridOne does not promise “free compute.” It offers a strategically different compute layer whose rewards may be delivered as services rather than cash. Providers still incur orchestration, verification, support, credit-redemption, compliance, and fraud costs.

### Objections to answer

- Data centers may be more efficient per useful computation.
- Consumer nodes are unreliable, slow, heterogeneous, and potentially malicious.
- Privacy, export controls, data residency, and licensing may exclude many tasks.
- Credit liabilities may cost more than conventional infrastructure.
- Community messaging cannot compensate for poor economics or weak security.

### First experiment

Benchmark one deterministic, divisible workload on local workers against a cloud baseline. Measure useful throughput, orchestration overhead, duplicate-work cost, verification rate, energy estimate, and failure recovery.

## Why would a developer use GridOne?

### Potential value

- Avoid committing early to dedicated infrastructure for supported asynchronous tasks.
- Reach Builders who may spend earned credits on the developer's AI product.
- Use one interface to schedule work across heterogeneous capacity.
- Make community participation part of the product story.

### Objections to answer

- Can the developer trust results from unknown machines?
- What latency and completion guarantees exist?
- How are models, prompts, data, and intellectual property protected?
- Is integration simpler than a conventional cloud API?
- Who is responsible when a node returns a harmful or incorrect result?

### First experiment

Give a developer a five-minute quickstart for one allow-listed task. Success means they can submit a job, observe fan-out, receive a verified result, and understand the cost without help.

## Why would someone become a Builder?

### Potential value

- Put an idle device to purposeful use.
- Earn AI Credits tied directly to learning, coding, research, and creativity.
- See exactly what the device contributed and what it cost.
- Join a community and be able to say: **“I helped build this.”**

### Objections to answer

- Electricity and hardware wear are real costs.
- “Idle” does not mean “free” or environmentally beneficial.
- People may fear malware, surveillance, data exposure, heat, noise, and battery damage.
- Movement language may attract initial interest but not long-term retention.
- Credits are worthless unless redemption is useful and dependable.

### First experiment

Ask 10 target Builders to install a prototype and choose contribution limits. Measure setup completion, perceived trust, interruption, willingness to run overnight, and which reward they actually value.

## Why AI Credits instead of cryptocurrency?

AI Credits connect the reward to the purpose of the network: access to intelligence. They can avoid speculative token dynamics and communicate value more simply.

However, credits create obligations. Before real launch, GridOne must define issuance, expiry, transferability, fraud recovery, taxation, consumer protection, service availability, and redemption economics. Build Week credits are clearly labeled as simulated and non-redeemable.

## Can microtasks really protect privacy?

Task splitting reduces how much context one node may see, but it is not a privacy proof. Some workloads cannot be split without revealing sensitive inputs. Encryption in transit does not protect data while ordinary hardware processes it.

The MVP therefore uses synthetic or public data, bounded task payloads, isolation, short retention, and allow-listed code. Future privacy options may include confidential computing, trusted execution environments, differential privacy, secure aggregation, or cryptographic verification—each evaluated by task class.

## Can results be verified?

Verification depends on the workload:

- Deterministic tasks can be recomputed or spot-checked.
- Probabilistic tasks may require redundancy, consensus, reference tests, or model-specific validation.
- High-value tasks may need trusted nodes or hardware attestation.
- Some tasks will remain unsuitable.

The Build Week MVP uses a deterministic or strongly checkable task and redundant execution for a small sample.

## Core risks

| Risk | MVP response | Longer-term direction |
| --- | --- | --- |
| Malicious workload | Allow-listed signed task types | Sandboxing, policy engine, review pipeline |
| Malicious worker | Verification and redundant sampling | Reputation, staking/penalties, attestation |
| Privacy leakage | Synthetic/public demo data | Task classification and privacy-preserving methods |
| Device disruption | Conservative thresholds and pause control | OS-native telemetry and adaptive policies |
| Credit fraud | Verified completion before accounting | Fraud models and auditable ledger |
| Weak economics | Instrument every unit of useful work | Market design and provider agreements |
| Greenwashing | Show energy estimates and uncertainty | Carbon-aware scheduling and lifecycle analysis |
| Regulatory exposure | No sensitive or restricted MVP data | Jurisdiction, residency, consent, and compliance controls |

## Kill criteria

GridOne should change direction if experiments show that supported workloads are consistently less efficient, less trustworthy, or less usable than alternatives after including verification and Builder costs; if users will not install the worker under transparent permissions; or if useful credit redemption cannot be made economically sustainable.

