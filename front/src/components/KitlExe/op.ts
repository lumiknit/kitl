/* ID */

export type ID = number;

export const argID = -1;
export const ctxID = -2;

/* Path */

export type FnPath = {
  mod: string;
  name: string;
};

export type OpPath = {
  fnPath: FnPath;
  op: number;
};

export const builtInModule = "-";

/* Op (Expr) */

export enum OpType {
  Literal,
  Mem,
  App,
  Comp,
  Select,
}

export type Op = {
  type: OpType;
  nodeID: string;
};

export type Literal = Op & {
  type: OpType.Literal;
  value: any;
};

export type Mem = Op & {
  type: OpType.Mem;
  arg: ID;
  slotID: number;
};

export type FnOp = Op & {
  fn: FnPath;
  ctx?: ID;
  arg?: ID;
};

export type App = FnOp & {
  type: OpType.App;
};

export type Comp = Op & {
  type: OpType.Comp;
};

export type Select = Op & {
  type: OpType.Select;
  cond: ID;
  then?: ID;
  else?: ID;
};

/* Function and Module */

export type Fn = {
  fnPath: FnPath;
  ops: Op[];
  numMemSlots: number;
};

export type Mod = {
  path: string;
  fns: { [key: string]: Fn };
};

export type Context = {
  /* Modules */
  mods: { [key: string]: Mod };
};

/* Helpers */

export type FnError = {
  path: FnPath;
  op?: number;
  msg: string;
};

export const emptyFn = (fnPath: FnPath): Fn => ({
  fnPath,
  ops: [],
  numMemSlots: 0,
});

export const findFnErros = (fn: Fn): true | FnError[] => {
  const errors = [];
  // Create memslot map
  const memSlots: boolean[] = [];
  for (let i = 0; i < fn.ops.length; i++) {
    switch (fn.ops[i].type) {
      case OpType.Mem:
        {
          const o = fn.ops[i] as Mem;
          if (
            !Number.isInteger(o.slotID) ||
            o.slotID < 0 ||
            o.slotID >= fn.numMemSlots
          ) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid slotID: ${o.slotID}`,
            });
          }
          memSlots[o.slotID] = true;
          if (o.arg < 0 || o.arg >= i) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid argID: ${o.arg}`,
            });
          }
        }
        break;
      case OpType.App:
      case OpType.Comp:
        {
          const o = fn.ops[i] as FnOp;
          if (o.ctx !== undefined && (o.ctx < 0 || o.ctx >= i)) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid ctxID: ${o.ctx}`,
            });
          }
          if (o.arg !== undefined && (o.arg < 0 || o.arg >= i)) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid argID: ${o.arg}`,
            });
          }
        }
        break;
      case OpType.Select:
        {
          const o = fn.ops[i] as Select;
          if (o.cond < 0 || o.cond >= i) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid condID: ${o.cond}`,
            });
          }
          if (o.then !== undefined && (o.then < 0 || o.then >= i)) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid thenID: ${o.then}`,
            });
          }
          if (o.else !== undefined && (o.else < 0 || o.else >= i)) {
            errors.push({
              path: fn.fnPath,
              op: i,
              msg: `Invalid elseID: ${o.else}`,
            });
          }
        }
        break;
    }
  }
  for (let i = 0; i < fn.numMemSlots; i++) {
    if (memSlots[i] === undefined) {
      errors.push({
        path: fn.fnPath,
        msg: `Unused memslot: ${i}`,
      });
    }
  }
  if (errors.length === 0) {
    return true;
  }
  return errors;
};

export const getFn = (context: Context, fnPath: FnPath): Fn | undefined => {
  const mod = context.mods[fnPath.mod];
  if (mod === undefined) {
    return undefined;
  }
  return mod.fns[fnPath.name];
};

export const getOp = (context: Context, opPath: OpPath): Op | undefined => {
  const fn = getFn(context, opPath.fnPath);
  if (fn === undefined) {
    return undefined;
  }
  return fn.ops[opPath.op];
};
