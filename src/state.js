import { EventEmitter } from "node:events";
import {
  TASK_TYPE,
  calculateCredits,
  createReceipt,
  splitText,
  verifyTaskResult
} from "./core.js";

const LEASE_MS = 5_000;
const OFFLINE_MS = 6_000;

function now() {
  return new Date().toISOString();
}

export class GridState extends EventEmitter {
  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.workers = new Map();
    this.jobs = new Map();
    this.tasks = new Map();
    this.ledger = [];
    this.events = [];
    this.stats = {
      rejectedResults: 0,
      requeuedTasks: 0,
      verifiedTasks: 0,
      totalCredits: 0
    };
    this.sequence = 0;
    this.log("network-reset", "GridOne coordinator is ready for Builders.");
    this.emit("change");
  }

  log(type, message, details = {}) {
    this.events.unshift({ id: ++this.sequence, type, message, details, at: now() });
    this.events = this.events.slice(0, 60);
  }

  registerWorker(input) {
    const existing = this.workers.get(input.id);
    const worker = {
      id: input.id,
      name: input.name || input.id,
      status: existing?.paused ? "paused" : "available",
      paused: existing?.paused || false,
      capabilities: input.capabilities || { taskTypes: [TASK_TYPE] },
      policy: input.policy || {},
      metrics: input.metrics || {},
      activeTaskId: null,
      verifiedTasks: existing?.verifiedTasks || 0,
      rejectedTasks: existing?.rejectedTasks || 0,
      credits: existing?.credits || 0,
      lastSeen: Date.now()
    };
    this.workers.set(worker.id, worker);
    this.log("worker-online", `${worker.name} joined the grid.`, { workerId: worker.id });
    this.emit("change");
    return worker;
  }

  heartbeat(id, input) {
    const worker = this.workers.get(id);
    if (!worker) return null;
    worker.lastSeen = Date.now();
    worker.metrics = input.metrics || worker.metrics;
    if (!worker.paused && !worker.activeTaskId) {
      worker.status = input.available === false ? "guarded" : "available";
    }
    this.emit("change");
    return worker;
  }

  createJob(text) {
    const jobId = `job_${String(this.jobs.size + 1).padStart(3, "0")}`;
    const chunks = splitText(text);
    const job = {
      id: jobId,
      title: "GridOne public-document vector job",
      status: "queued",
      createdAt: now(),
      completedAt: null,
      taskIds: []
    };

    chunks.forEach((chunk, index) => {
      const id = `${jobId}_task_${String(index + 1).padStart(2, "0")}`;
      const task = {
        id,
        jobId,
        type: TASK_TYPE,
        payload: { text: chunk, chunkIndex: index },
        status: "queued",
        attempts: 0,
        leaseWorkerId: null,
        leaseExpiresAt: null,
        result: null,
        rejectionReason: null,
        updatedAt: now()
      };
      this.tasks.set(id, task);
      job.taskIds.push(id);
    });

    this.jobs.set(jobId, job);
    this.log("job-created", `${job.title} split into ${chunks.length} verifiable microtasks.`, {
      jobId,
      tasks: chunks.length
    });
    this.emit("change");
    return job;
  }

  leaseTask(workerId) {
    this.sweep();
    const worker = this.workers.get(workerId);
    if (!worker || worker.paused || worker.status !== "available") return null;

    const task = [...this.tasks.values()].find((candidate) => candidate.status === "queued");
    if (!task) return null;

    task.status = "leased";
    task.attempts += 1;
    task.leaseWorkerId = worker.id;
    task.leaseExpiresAt = Date.now() + LEASE_MS;
    task.updatedAt = now();
    worker.activeTaskId = task.id;
    worker.status = "working";
    this.jobs.get(task.jobId).status = "running";
    this.log("task-leased", `${task.id} assigned to ${worker.name}.`, {
      workerId,
      taskId: task.id,
      attempt: task.attempts
    });
    this.emit("change");
    return { ...task, leaseMs: LEASE_MS };
  }

  submitResult(workerId, taskId, result) {
    const worker = this.workers.get(workerId);
    const task = this.tasks.get(taskId);
    if (!worker || !task) return { accepted: false, reason: "unknown-worker-or-task" };
    if (task.status !== "leased" || task.leaseWorkerId !== workerId) {
      return { accepted: false, reason: "lease-no-longer-active" };
    }

    worker.activeTaskId = null;
    worker.status = worker.paused ? "paused" : "available";
    const verification = verifyTaskResult(task, result);

    if (!verification.valid) {
      task.status = "queued";
      task.leaseWorkerId = null;
      task.leaseExpiresAt = null;
      task.rejectionReason = verification.reason;
      task.updatedAt = now();
      worker.rejectedTasks += 1;
      this.stats.rejectedResults += 1;
      this.stats.requeuedTasks += 1;
      this.log("result-rejected", `${worker.name}'s result was rejected and safely requeued.`, {
        workerId,
        taskId,
        reason: verification.reason
      });
      this.emit("change");
      return { accepted: false, reason: verification.reason, requeued: true };
    }

    const credits = calculateCredits(task, result);
    const receipt = createReceipt({ task, worker, result, credits });
    task.status = "verified";
    task.result = result;
    task.leaseWorkerId = null;
    task.leaseExpiresAt = null;
    task.rejectionReason = null;
    task.updatedAt = now();
    worker.verifiedTasks += 1;
    worker.credits += credits;
    this.ledger.unshift(receipt);
    this.stats.verifiedTasks += 1;
    this.stats.totalCredits += credits;
    this.log("result-verified", `${task.id} verified. ${worker.name} earned ${credits} AI Credits.`, {
      workerId,
      taskId,
      receiptId: receipt.receiptId,
      credits
    });

    this.updateJob(task.jobId);
    this.emit("change");
    return { accepted: true, verified: true, credits, receipt };
  }

  setWorkerPaused(workerId, paused) {
    const worker = this.workers.get(workerId);
    if (!worker) return null;
    worker.paused = Boolean(paused);
    if (worker.paused && worker.activeTaskId) {
      this.requeueTask(worker.activeTaskId, "builder-paused");
    }
    worker.status = worker.paused ? "paused" : "available";
    this.log(
      worker.paused ? "worker-paused" : "worker-resumed",
      `${worker.name} ${worker.paused ? "paused contribution" : "resumed contribution"}.`,
      { workerId }
    );
    this.emit("change");
    return worker;
  }

  requeueTask(taskId, reason) {
    const task = this.tasks.get(taskId);
    if (!task || task.status !== "leased") return;
    const worker = this.workers.get(task.leaseWorkerId);
    if (worker) worker.activeTaskId = null;
    task.status = "queued";
    task.leaseWorkerId = null;
    task.leaseExpiresAt = null;
    task.updatedAt = now();
    this.stats.requeuedTasks += 1;
    this.log("task-requeued", `${task.id} requeued: ${reason}.`, { taskId, reason });
  }

  sweep() {
    const time = Date.now();
    for (const task of this.tasks.values()) {
      if (task.status === "leased" && task.leaseExpiresAt < time) {
        this.requeueTask(task.id, "lease-expired");
      }
    }
    for (const worker of this.workers.values()) {
      if (time - worker.lastSeen > OFFLINE_MS) {
        if (worker.activeTaskId) this.requeueTask(worker.activeTaskId, "worker-offline");
        worker.status = "offline";
      }
    }
  }

  updateJob(jobId) {
    const job = this.jobs.get(jobId);
    const tasks = job.taskIds.map((id) => this.tasks.get(id));
    if (tasks.every((task) => task.status === "verified")) {
      job.status = "completed";
      job.completedAt = now();
      this.log("job-completed", `${job.title} completed with ${tasks.length} verified tasks.`, {
        jobId
      });
    } else if (tasks.some((task) => task.status === "leased" || task.status === "verified")) {
      job.status = "running";
    }
  }

  snapshot() {
    this.sweep();
    return {
      prototype: true,
      creditsRedeemable: false,
      workers: [...this.workers.values()].map((worker) => ({ ...worker })),
      jobs: [...this.jobs.values()].map((job) => ({ ...job })),
      tasks: [...this.tasks.values()].map((task) => ({
        ...task,
        payload: { chunkIndex: task.payload.chunkIndex, wordCount: task.payload.text.split(/\s+/).length }
      })),
      ledger: this.ledger.slice(0, 20),
      events: this.events.slice(0, 30),
      stats: { ...this.stats }
    };
  }
}

