# GitHub Project Board Specification

## Board name

**GridOne AI — Build Week**

## Workflow columns

GitHub Projects uses a single-select **Status** field. Configure these options in order:

1. Backlog
2. Product Sprint
3. Architecture
4. Build
5. Demo
6. Devpost
7. Done

Use the Board layout and group by Status.

## Seed tasks

| Task | Initial status | Outcome |
| --- | --- | --- |
| Finalize mission, category, and product principles | Product Sprint | Approved language across core docs |
| Interview five prospective Builders | Product Sprint | Trust and motivation findings |
| Validate developer value proposition | Product Sprint | One primary developer job-to-be-done |
| Define prototype AI Credit formula and disclosures | Product Sprint | Transparent non-redeemable accounting |
| Select safe, divisible, verifiable demo workload | Product Sprint | Decision record and benchmark plan |
| Create low-fidelity Builder journey mockups | Product Sprint | Welcome, controls, live work, receipt, dashboard |
| Freeze job, task, worker, receipt, and credit contracts | Architecture | Versioned schemas |
| Write MVP threat model | Architecture | Trust boundaries and mitigations |
| Benchmark workload across two local workers | Architecture | Throughput and verification data |
| Build coordinator and task state machine | Build | Jobs and tasks complete their lifecycle |
| Build Smart Contribution worker | Build | Policies, pause, lease, and bounded runner |
| Implement verifier and redundant sampling | Build | Valid result passes; tampered result fails |
| Implement prototype credit ledger | Build | Verified work creates traceable credits |
| Build Builder dashboard | Build | Live state, controls, receipts, and balance |
| Add automated end-to-end demo test | Build | Reproducible multi-worker run |
| Create logo and visual system | Demo | Reusable brand assets |
| Create architecture diagram and product screenshots | Demo | Submission-ready visuals |
| Rehearse and record 90-second demo | Demo | Primary and fallback video |
| Finalize Devpost project story | Devpost | All fields complete and accurate |
| Document actual OpenAI and Codex usage | Devpost | Evidence-backed Build Week section |
| Perform submission readiness review | Devpost | Rules, links, claims, privacy, and assets checked |

## Suggested fields

- **Status:** the seven options above.
- **Priority:** P0, P1, P2.
- **Workstream:** Product, Architecture, Worker, Coordinator, Verification, Dashboard, Brand, Demo, Devpost.
- **Type:** Decision, Research, Design, Build, Test, Content.
- **Owner:** GitHub assignee or text field.
- **Target:** Build Week, Pilot, Network.

## Views

- **Sprint board:** Board grouped by Status, filtered to Target = Build Week.
- **By workstream:** Table grouped by Workstream.
- **P0 launch list:** Table filtered to Priority = P0 and Status ≠ Done.
- **Roadmap:** Roadmap layout grouped by Target after dates are established.

## Automation

- New items default to Backlog.
- Closed issues move to Done.
- Reopened issues move to Backlog.
- Pull requests should link the issue they advance.

