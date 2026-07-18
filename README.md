# GridOne AI

> **Don't just use AI. Help build it.**

GridOne AI is a proposed collaborative compute network that lets people securely contribute idle device capacity to suitable AI workloads and earn AI Credits in return.

## Vision

**Turn humanity into the world's largest collaborative AI infrastructure.**

AI capability is increasingly shaped by access to expensive, centralized infrastructure. At the same time, billions of personal devices contain useful capacity that often sits idle. GridOne explores whether those devices can form a safe, transparent, community-powered layer for divisible AI workloads.

GridOne is not a promise to replace hyperscale data centers. It is a Build Week prototype of a complementary model: people participate in AI infrastructure, developers access a new compute layer, and value flows back to the people who contribute it.

## The Build Week proof

The MVP demonstrates one complete, honest loop:

1. A Builder installs or opens a worker client.
2. Smart Contribution determines whether the device can safely accept work.
3. A coordinator assigns a bounded, allow-listed AI microtask.
4. The worker executes it in isolation and returns a result plus evidence.
5. The coordinator verifies the result.
6. The Builder receives simulated AI Credits and sees the contribution in a dashboard.

The demo uses two or more real worker processes. It does not claim production-grade privacy, global scale, training of frontier models, or redeemable credits.

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

**Product Sprint.** The immediate goal is to validate the value proposition, lock the MVP contract, establish trust boundaries, and design the demo before implementation begins.

## Working language

Project artifacts are written in English for Build Week and international collaboration. Product decisions should be recorded in the relevant living document rather than left only in chat.

