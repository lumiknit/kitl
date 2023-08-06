import * as jh from "./helper";

interface IAction {
  inverse(): IAction;
  updateRoot(value: jh.Json): jh.Json;
  updateArray(parent: jh.JsonArray, key: number): jh.Json;
  updateObject(parent: jh.JsonObject, key: string): jh.Json;
  apply(json: jh.Json): jh.Json;
}

class Action implements IAction {
  path: jh.JsonPath;

  constructor(path: jh.JsonPath) {
    this.path = path;
  }

  inverse(): Action {
    throw "Unimplemented, use inherited class";
  }

  updateRoot(_value: jh.Json): jh.Json {
    console.log(_value);
    throw "Unimplemented, use inherited class";
  }

  updateArray(_parent: jh.JsonArray, _key: number): jh.Json {
    console.log(_parent, _key);
    throw "Unimplemented, use inherited class";
  }

  updateObject(_parent: jh.JsonObject, _key: string): jh.Json {
    console.log(_parent, _key);
    throw "Unimplemented, use inherited class";
  }

  apply(json: jh.Json): jh.Json {
    if (this.path.length === 0) {
      // In this case, just return the valuee
      return this.updateRoot(json);
    }
    // Otherwise, create parents list, instead of recursive edit
    const parents = new Array(this.path.length);
    parents[0] = json;
    // Dive to the path
    for (let i = 0; i < this.path.length - 1; i++) {
      const p = parents[i];
      if (typeof p !== "object" || p === null) {
        throw `Cannot access non-object parent ${p} during traverse ${this.path}`;
      }
      const idx = this.path[i];
      if (Array.isArray(p)) {
        if (typeof idx !== "number") {
          throw `Index of array must be a number`;
        }
        parents[i + 1] = parents[i][idx];
      } else {
        if (typeof idx !== "string") {
          throw `Index of object must be a string`;
        }
        parents[i + 1] = parents[i][idx];
      }
    }
    // Update the value
    let v = parents[this.path.length - 1];
    if (typeof v !== "object" || v === null) {
      throw `Cannot access non-object parent ${v} during traverse ${this.path}`;
    }
    const idx = this.path[this.path.length - 1];
    if (Array.isArray(v)) {
      if (typeof idx !== "number") {
        throw `Index of array must be a number`;
      }
      v = this.updateArray(v, idx);
    } else {
      if (typeof idx !== "string") {
        throw `Index of object must be a string`;
      }
      v = this.updateObject(v, idx);
    }
    // Pack to upward
    for (let i = this.path.length - 2; i >= 0; i--) {
      const p = parents[i];
      const k = this.path[i];
      if (Array.isArray(p) && typeof k === "number") {
        const t = [...p];
        t[k] = v;
        v = t;
      } else if (typeof p === "object" && p !== null && typeof k === "string") {
        v = { ...p, [k]: v };
      } else {
        throw "Unreachable";
      }
    }
    // Return new root
    return v;
  }
}

export class InsertAction extends Action {
  value: jh.Json;

  constructor(path: jh.JsonPath, value: jh.Json) {
    super(path);
    this.value = value;
  }

  inverse() {
    return new DeleteAction(this.path, this.value);
  }

  updateRoot(): jh.Json {
    return this.value;
  }

  updateArray(parent: jh.JsonArray, key: number): jh.Json {
    return parent.slice(0, key).concat([this.value], parent.slice(key));
  }

  updateObject(parent: jh.JsonObject, key: string): jh.Json {
    return { ...parent, [key]: this.value };
  }
}

export class DeleteAction extends Action {
  oldValue: jh.Json;

  constructor(path: jh.JsonPath, oldValue?: jh.Json) {
    super(path);
    if (oldValue === undefined) {
      this.oldValue = null;
    } else {
      this.oldValue = oldValue;
    }
  }

  inverse() {
    return new InsertAction(this.path, this.oldValue);
  }

  updateRoot(parent: jh.Json): jh.Json {
    this.oldValue = parent;
    return null;
  }

  updateArray(parent: jh.JsonArray, key: number): jh.Json {
    this.oldValue = parent[key];
    return parent.slice(0, key).concat(parent.slice(key + 1));
  }

  updateObject(parent: jh.JsonObject, key: string): jh.Json {
    this.oldValue = parent[key];
    const newO = { ...parent };
    delete newO[key];
    return newO;
  }
}

export class UpdateAction extends Action {
  value: jh.Json;
  oldValue: jh.Json;

  constructor(path: jh.JsonPath, value: jh.Json, oldValue?: jh.Json) {
    super(path);
    this.value = value;
    if (oldValue === undefined) {
      this.oldValue = null;
    } else {
      this.oldValue = oldValue;
    }
  }

  inverse() {
    return new UpdateAction(this.path, this.oldValue, this.value);
  }

  updateRoot(value: jh.Json): jh.Json {
    this.oldValue = value;
    return this.value;
  }

  updateArray(parent: jh.JsonArray, key: number): jh.Json {
    this.oldValue = parent[key];
    const newA = [...parent];
    newA[key] = this.value;
    return newA;
  }

  updateObject(parent: jh.JsonObject, key: string): jh.Json {
    this.oldValue = parent[key];
    return { ...parent, [key]: this.value };
  }
}

export type JsonEdit = {
  value: jh.Json;
  oldValue?: jh.Json;
  maxHistory: number;
  undoList: Action[][];
  redoList: Action[][];
};

export const newJsonEdit = (value: jh.Json, maxHistory = 128): JsonEdit => {
  return {
    value: value,
    maxHistory: maxHistory,
    undoList: [],
    redoList: [],
  };
};

export const applyJsonEdit = (actions: Action[]) => (edit: JsonEdit) => {
  let v = edit.value;
  for (const action of actions) {
    v = action.apply(v);
  }
  return {
    ...edit,
    value: v,
    undoList: [...edit.undoList, actions],
    redoList: [],
  };
};

export const undoable = (edit: JsonEdit) => {
  return edit.undoList.length > 0;
};

export const redoable = (edit: JsonEdit) => {
  return edit.redoList.length > 0;
};

export const undo = (edit: JsonEdit) => {
  if (!undoable(edit)) {
    return edit;
  }
  const actions = edit.undoList[edit.undoList.length - 1];
  let v = edit.value;
  for (let i = actions.length - 1; i >= 0; i--) {
    v = actions[i].inverse().apply(v);
  }
  return {
    ...edit,
    value: v,
    undoList: edit.undoList.slice(0, edit.undoList.length - 1),
    redoList: [...edit.redoList, actions],
  };
};

export const redo = (edit: JsonEdit) => {
  if (!redoable(edit)) {
    return edit;
  }
  const actions = edit.redoList[edit.redoList.length - 1];
  let v = edit.value;
  for (const action of actions) {
    v = action.apply(v);
  }
  return {
    ...edit,
    value: v,
    undoList: [...edit.undoList, actions],
    redoList: edit.redoList.slice(0, edit.redoList.length - 1),
  };
};

export type UpdateEdit = (editing: JsonEdit) => JsonEdit;
