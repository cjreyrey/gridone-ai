# GridOne AI

> **Don't just use AI. Help build it.**

GridOne AI is a working Build Week prototype of a collaborative compute network. It lets people contribute idle device capacity to a safe, allow-listed AI workload and earn prototype AI Credits only after their work is verified.

**Live demo:** https://cjreyrey.github.io/gridone-ai/

## Vision

**Turn humanity into the world's largest collaborative AI infrastructure.**

AI capability is increasingly shaped by access to expensive, centralized infrastructure. At the same time, billions of personal devices contain useful capacity that often sits idle. GridOne explores whether those devices can form a safe, transparent, community-powered layer for divisible AI workloads.

GridOne is not a promise to replace hyperscale data centers. It is a Build Week prototype of a complementary model: people participate in AI infrastructure, developers access a new compute layer, and value flows back to the people who contribute it.

## The Build Week proof

The implemented MVP demonstrates one complete, honest loop:

1. A Builder installs or opens a worker client.
2. Smart Contribution determines whether the device can safely accept work.
3. A coordinator assigns a bounded, allow-listed AI microtask.
4. The worker executes it in isolation and returns a result plus evidence.
5. The coordinator verifies the result.
6. The Builder receives simulated AI Credits and sees the contribution in a dashboard.

The public demo uses two isolated browser workers; the downloadable desktop demo uses two separate operating-system worker processes. In both modes, one worker intentionally returns a tampered result so the verifier can reject and requeue it. GridOne does not claim production-grade privacy, global scale, training of frontier models, or redeemable credits.

## Run the prototype

For the fastest test, open the [public GridOne demo](https://cjreyrey.github.io/gridone-ai/) and select **Start verified job**.

For the stronger desktop proof with separate operating-system processes:

Requirements: Node.js 20 or newer. GridOne has no third-party runtime dependencies and needs no API key.

```bash
npm run demo
```

Open [http://127.0.0.1:8787](http://127.0.0.1:8787), then select **Start verified job**.

The demo launcher starts:

- a real HTTP coordinator;
- `Madrid-Builder`, a separate worker process;
- `Berlin-Builder`, a separate worker process configured to tamper with its first result;
- the Builder dashboard and audit trail.

To run the automated verification suite:

```bash
npm test
```

The end-to-end test launches a coordinator and two workers, confirms the tampered result is rejected, waits for every task to be verified, and proves that credits match verified receipts.

## What is implemented

- Job decomposition into bounded public-document vector microtasks.
- Worker registration, real host telemetry, and Smart Contribution guards.
- Task leases, expiry, retry, manual pause, and reassignment.
- Deterministic feature-hash vectors with digest, token-count, and numerical verification.
- Intentional tamper test and visible rejection event.
- Append-only prototype credit receipts gated by successful verification.
- A responsive dashboard showing workers, task state, audit events, and credit receipts.
- Five passing tests, including a real multi-process end-to-end run.

## Technology

GridOne deliberately uses only Node.js built-ins plus browser-native HTML, CSS, and JavaScript. This keeps installation fast, makes the judging build reproducible, and ensures the distributed behavior is visible rather than hidden behind infrastructure dependencies.

```text
Browser dashboard
      ↓ HTTP
Coordinator + scheduler
      ↓ leases
Independent worker processes
      ↓ result + receipt
Verifier → credit ledger
```

## How we collaborated with Codex

Codex was used throughout the Build Week project—not only to generate code. The collaboration included:

- pressure-testing the original decentralized-compute concept;
- separating the long-term cooperative vision from an honest one-week MVP;
- defining trust boundaries, non-goals, task contracts, and verification rules;
- implementing the coordinator, worker protocol, verifier, ledger, dashboard, and tests;
- running the live multi-worker demo and visually reviewing the product experience;
- identifying and correcting claims that could not yet be demonstrated;
- keeping the Devpost story aligned with the code that judges can run.

The key human product decision was to position GridOne as a complementary layer for safe, divisible workloads—not as a replacement for hyperscale data centers. The key engineering decision was to avoid arbitrary remote code and use one allow-listed, independently verifiable task type.

Before final submission, the Devpost entry will include the `/feedback` Codex Session ID for this build thread and the verified model/session evidence required by the rules.

## Product principles

- **Builders, not users.** Participation and agency are central to the experience.
- **Smart Contribution.** The Builder sets limits; foreground device use always wins.
- **Safe tasks only.** Workers run versioned, allow-listed workloads rather than arbitrary remote code.
- **Verify before reward.** Results earn credits only after validation.
- **Privacy by design.** Minimize data, isolate work, and never imply that task splitting alone guarantees privacy.
- **Transparent economics.** Show how contributions and credits are measured.
- **Honest demonstration.** Clearly label what is real, simulated, and future work.

## Living workspace

| Document | Purpose |
| --- | --- |
| [MANIFESTO.md](MANIFESTO.md) | The belief and movement behind GridOne |
| [VISION.md](VISION.md) | Long-term direction, category, and success model |
| [PRESSURE_TEST.md](PRESSURE_TEST.md) | Stakeholder value, objections, risks, and experiments |
| [PRODUCT.md](PRODUCT.md) | Builders, journeys, experience, credits, and trust |
| [ARCHITECTURE.md](ARCHITECTURE.md) | MVP system design, protocols, and security boundaries |
| [MVP.md](MVP.md) | One-week scope, acceptance criteria, and non-goals |
| [ROADMAP.md](ROADMAP.md) | Sprint sequence and post-hackathon path |
| [DEMO.md](DEMO.md) | Demo storyboard, setup, fallbacks, and evidence |
| [PITCH.md](PITCH.md) | 90-second spoken pitch and judge Q&A |
| [DEVPOST.md](DEVPOST.md) | Submission-ready project story and checklist |
| [docs/README.md](docs/README.md) | Visual asset map and naming conventions |

## Repository map

```text
gridone-ai/
├── README.md
├── MANIFESTO.md
├── VISION.md
├── PRESSURE_TEST.md
├── PRODUCT.md
├── ARCHITECTURE.md
├── MVP.md
├── ROADMAP.md
├── DEMO.md
├── PITCH.md
├── DEVPOST.md
├── .github/
│   └── PROJECT_BOARD.md
└── docs/
    ├── ui/
    ├── diagrams/
    ├── logos/
    └── presentation/
```

## Current phase

**Working prototype.** The core end-to-end loop is implemented and tested. Remaining submission work is deployment/test access, final visual assets, the public demo video, `/feedback` session evidence, and Devpost completion.

## Working language

Project artifacts are written in English for Build Week and international collaboration. Product decisions should be recorded in the relevant living document rather than left only in chat.

## License

[MIT](LICENSE)

