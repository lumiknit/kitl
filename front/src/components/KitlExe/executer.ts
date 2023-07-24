import * as o from "./op";
import * as b from "./builtins";

type Slot = {
  subscriber: string[];
  value: any;
  locked?: boolean;
};

/* Frame */

type Frame = {
  id: string;
  fn: o.Fn;
  slots: Slot[];
};

const newFrame = (id: string, fn: o.Fn): Frame => {
  return {
    id: id,
    fn: fn,
    slots: new Array(fn.numMemSlots),
  };
};

/* Job */

enum JobType {
  Expand,
  App,
  Comp,
  Select,
  Mem,
  Literal,
}

type BaseJob = {
  type: JobType;
  id: string;
  frame: Frame;
  opPath: o.OpPath;
  subscribing: string[];
  retSlotID: string;
};

type ExpandJob = BaseJob & {
  type: JobType.Expand;
};

type FnJob = BaseJob & {
  fnPath: o.FnPath;
  ctxSlotID: string;
  argSlotID: string;
};

type AppJob = FnJob & {
  type: JobType.App;
};

type CompJob = FnJob & {
  type: JobType.Comp;
};

type SelectJob = BaseJob & {
  type: JobType.Select;
  condSlotID: string;
  thenPath?: o.OpPath;
  elsePath?: o.OpPath;
};

type MemJob = BaseJob & {
  type: JobType.Mem;
  argSlotID: string;
};

type LiteralJob = BaseJob & {
  type: JobType.Literal;
  value: any;
};

type Job =
  | BaseJob
  | ExpandJob
  | AppJob
  | CompJob
  | SelectJob
  | MemJob
  | LiteralJob;

type ApplyContext = {
  // Context
  context: o.Context;
  // Trigger information
  fnPath: o.FnPath;
  ctx: any;
  arg: any;
  // Executaion State
  retSlotID: string;
  nextID: number;
  slots: { [key: string]: Slot };
  jobs: Job[];
  waiting: { [key: string]: Job };
};

const newApplyContext = (
  context: o.Context,
  fnPath: o.FnPath,
  ctx: any,
  arg: any,
): ApplyContext => {
  return {
    context: context,
    fnPath: fnPath,
    ctx: ctx,
    arg: arg,
    retSlotID: "##ret",
    nextID: 0,
    slots: {},
    jobs: [],
    waiting: {},
  };
};

const allocID = (ac: ApplyContext): string => {
  const id = `s-${ac.nextID}`;
  ac.nextID += 1;
  return id;
};

const allocSlots = (
  ac: ApplyContext,
  num: number,
  subscriber: string,
): string[] => {
  const ids = new Array(num);
  for (let i = 0; i < num; i++) {
    const id = allocID(ac);
    ac.slots[id] = {
      subscriber: [subscriber],
      value: undefined,
    };
    ids[i] = id;
  }
  return ids;
};

const putSlotValue = (ac: ApplyContext, id: string, value: any): void => {
  // Set value
  const slot = ac.slots[id];
  if (slot === undefined) {
    throw new Error(`Unexpected undefined slot ${id}`);
  }
  slot.value = value;
  // Trigger subscribers
  for (const sub of slot.subscriber) {
    const job = ac.waiting[sub];
    if (job === undefined) {
      throw new Error(`Unexpected undefined job ${sub}`);
    }
    // Check if all subscribers are ready
    let ready = true;
    for (const s of job.subscribing) {
      const sSlot = ac.slots[s];
      if (sSlot === undefined) {
        throw new Error(`Unexpected undefined slot ${s}`);
      }
      if (sSlot.value === undefined) {
        ready = false;
        break;
      }
    }
    if (ready) {
      ac.jobs.push(job);
      delete ac.waiting[sub];
    }
  }
};

const handleBuiltInFn = async (
  ac: ApplyContext,
  opPath: o.OpPath,
  ctx: any,
  arg: any,
  retSlotID: string,
) => {
  const name = opPath.fnPath.name;
  let ret;
  if (name.charAt(0) === ".") {
    // Indexing
    const key = name.slice(1);
    if (Array.isArray(arg)) {
      if (typeof key === "number") {
        ret = arg[key];
      } else {
        ret = null;
      }
    } else if (typeof arg === "object") {
      ret = arg[key];
    } else {
      ret = null;
    }
  } else {
    const f = b.builtins[name];
    if (f !== undefined) {
      ret = await f(ctx, arg);
    }
  }
  putSlotValue(ac, retSlotID, ret);
};

const addExpandJob = (
  ac: ApplyContext,
  retSlotID: string,
  job: Job,
  op: number,
) => {
  const expJob: ExpandJob = {
    type: JobType.Expand,
    id: allocID(ac),
    frame: job.frame,
    opPath: {
      fnPath: job.opPath.fnPath,
      op: op,
    },
    subscribing: [],
    retSlotID: retSlotID,
  };
  ac.jobs.push(expJob);
};

const addExpandJobOrNull = (
  ac: ApplyContext,
  retSlotID: string,
  job: Job,
  op: number | undefined,
) => {
  if (op === undefined) {
    putSlotValue(ac, retSlotID, null);
  } else {
    addExpandJob(ac, retSlotID, job, op);
  }
};

const expandFnJob = (ac: ApplyContext, j: ExpandJob, t: JobType): void => {
  const op = j.frame.fn.ops[j.opPath.op];
  const o = op as o.FnOp;
  const id = allocID(ac);
  const subs = allocSlots(ac, 2, id);
  const job: FnJob = {
    type: t,
    id: id,
    frame: j.frame,
    opPath: j.opPath,
    subscribing: subs,
    retSlotID: j.retSlotID,
    fnPath: o.fn,
    ctxSlotID: subs[0],
    argSlotID: subs[1],
  };
  ac.waiting[id] = job;
  addExpandJobOrNull(ac, subs[0], job, o.ctx);
  addExpandJobOrNull(ac, subs[1], job, o.arg);
};

const expandJob = (ac: ApplyContext, j: ExpandJob): void => {
  const op = j.frame.fn.ops[j.opPath.op];
  switch (op.type) {
    case o.OpType.App:
      {
        expandFnJob(ac, j, JobType.App);
      }
      break;
    case o.OpType.Comp:
      {
        expandFnJob(ac, j, JobType.Comp);
      }
      break;
    case o.OpType.Select:
      {
        const o = op as o.Select;
        const id = allocID(ac);
        const subs = allocSlots(ac, 1, id);
        const thenPath =
          o.then === undefined
            ? undefined
            : {
                fnPath: j.opPath.fnPath,
                op: o.then,
              };
        const elsePath =
          o.else === undefined
            ? undefined
            : {
                fnPath: j.opPath.fnPath,
                op: o.else,
              };
        const job: SelectJob = {
          type: JobType.Select,
          id: id,
          frame: j.frame,
          opPath: j.opPath,
          subscribing: subs,
          retSlotID: j.retSlotID,
          condSlotID: subs[0],
          thenPath: thenPath,
          elsePath: elsePath,
        };
        ac.waiting[id] = job;
        addExpandJobOrNull(ac, subs[0], job, o.cond);
      }
      break;
    case o.OpType.Mem:
      {
        const o = op as o.Mem;
        const slot = j.frame.slots[o.slotID];
        // Check already calculated
        if (slot.value !== undefined) {
          putSlotValue(ac, j.retSlotID, j.frame.slots[o.slotID].value);
          return;
        }
        // Otherwise expand
        const id = allocID(ac);
        const subs = allocSlots(ac, 1, id);
        const job: MemJob = {
          type: JobType.Mem,
          id: id,
          frame: j.frame,
          opPath: j.opPath,
          subscribing: subs,
          retSlotID: j.retSlotID,
          argSlotID: subs[0],
        };
        ac.waiting[id] = job;
        slot.subscriber.push(subs[0]);
        if (!slot.locked) {
          // If nobody try to calculate the value, calculate it
          slot.locked = true;
          addExpandJobOrNull(ac, subs[0], job, o.arg);
        }
      }
      break;
  }
};

const applyLoop = async (ac: ApplyContext): Promise<any> => {
  while (ac.jobs.length > 0) {
    const job = ac.jobs.pop();
    if (job === undefined) {
      throw new Error("Unexpected undefined job");
    }
    switch (job.type) {
      case JobType.Expand:
        expandJob(ac, job as ExpandJob);
        break;
      case JobType.App:
        {
          const j = job as AppJob;
          const ctxSlot = ac.slots[j.ctxSlotID];
          const argSlot = ac.slots[j.argSlotID];
          if (ctxSlot === undefined || ctxSlot.value === undefined) {
            throw new Error(`Unexpected undefined slot ${j.ctxSlotID}`);
          }
          if (argSlot === undefined || argSlot.value === undefined) {
            throw new Error(`Unexpected undefined slot ${j.argSlotID}`);
          }
          const ctx = ctxSlot.value;
          const arg = argSlot.value;
          if (j.fnPath.mod === o.builtInModule) {
            // Run built-in function
            const val = await handleBuiltInFn(
              ac,
              j.opPath,
              ctx,
              arg,
              j.retSlotID,
            );
            putSlotValue(ac, j.retSlotID, val);
          } else {
            // Expand function
            const fn = o.getFn(ac.context, j.fnPath);
            if (fn === undefined) {
              throw new Error(`Unexpected undefined fn ${j.fnPath}`);
            }
            const lastOpPath = {
              fnPath: j.fnPath,
              op: fn.ops.length - 1,
            };
            const expJob: ExpandJob = {
              type: JobType.Expand,
              id: allocID(ac),
              frame: newFrame(allocID(ac), fn),
              opPath: lastOpPath,
              subscribing: [],
              retSlotID: j.retSlotID,
            };
            ac.jobs.push(expJob);
          }
        }
        break;
      case JobType.Comp:
        {
          const j = job as CompJob;
          const ctxSlot = ac.slots[j.ctxSlotID];
          const argSlot = ac.slots[j.argSlotID];
          if (ctxSlot === undefined || ctxSlot.value === undefined) {
            throw new Error(`Unexpected undefined slot ${j.ctxSlotID}`);
          }
          if (argSlot === undefined || argSlot.value === undefined) {
            throw new Error(`Unexpected undefined slot ${j.argSlotID}`);
          }
          const ctx = ctxSlot.value;
          const arg = argSlot.value;
          const val = {
            "#ctx": ctx,
            "#arg": arg,
            "#fn": j.fnPath,
          };
          putSlotValue(ac, j.retSlotID, val);
        }
        break;
      case JobType.Select:
        {
          const j = job as SelectJob;
          const condSlot = ac.slots[j.condSlotID];
          if (condSlot === undefined || condSlot.value === undefined) {
            throw new Error("Unexpected undefined condSlotID");
          }
          const cond = condSlot.value;
          let opPath;
          if (cond) {
            // Do Something
            opPath = j.thenPath;
          } else {
            // Do Otherthing
            opPath = j.elsePath;
          }
          if (opPath === undefined) {
            putSlotValue(ac, j.retSlotID, null);
          } else {
            const expJob: ExpandJob = {
              type: JobType.Expand,
              id: allocID(ac),
              frame: j.frame,
              opPath: opPath,
              subscribing: [],
              retSlotID: j.retSlotID,
            };
            ac.jobs.push(expJob);
          }
        }
        break;
      case JobType.Mem:
        {
          const j = job as MemJob;
          const argSlot = ac.slots[j.argSlotID];
          if (argSlot === undefined || argSlot.value === undefined) {
            throw new Error(`Unexpected undefined slot ${j.argSlotID}`);
          }
          putSlotValue(ac, j.retSlotID, argSlot.value);
        }
        break;
      case JobType.Literal:
        {
          const j = job as LiteralJob;
          putSlotValue(ac, j.retSlotID, j.value);
        }
        break;
    }
  }
};

export const apply = async (
  context: o.Context,
  fnPath: o.FnPath,
  ctx: any,
  arg: any,
): Promise<any> => {
  const ac = newApplyContext(context, fnPath, ctx, arg);
  // Dummy function path
  const dummyFn = o.emptyFn({
    mod: "##root",
    name: "##root",
  });
  // Set-up the initial job
  const subs = allocSlots(ac, 2, "##root");
  const job: AppJob = {
    type: JobType.App,
    id: "##root",
    frame: newFrame("##root", dummyFn),
    retSlotID: ac.retSlotID,
    subscribing: subs,
    opPath: {
      fnPath: dummyFn.fnPath,
      op: 0,
    },
    fnPath: fnPath,
    ctxSlotID: subs[0],
    argSlotID: subs[1],
  };
  ac.jobs.push(job);
  return await applyLoop(ac);
};
