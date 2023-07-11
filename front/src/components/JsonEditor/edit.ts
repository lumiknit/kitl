import * as jh from "./helper";

class Action {
  path: jh.JsonPath;

  constructor(path: jh.JsonPath) {
    this.path = path;
  }

  inverse(): Action {
    throw "Unimplemented, use inherited class";
  }

  updateRoot(_value: jh.Json): jh.Json {
    throw "Unimplemented, use inherited class";
  }

  updateArray(_parent: jh.JsonArray, _key: number): jh.Json {
    throw "Unimplemented, use inherited class";
  }

  updateObject(_parent: jh.JsonObject, _key: string): jh.Json {
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

  updateRoot(_value: jh.Json): jh.Json {
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

export class JsonEdit {
  value: jh.Json;
  maxHistory: number;
  history: Action[][];
  hHead: number;
  hCurr: number;
  hTail: number;

  constructor(value: jh.Json, maxHistory = 128) {
    this.value = value;
    this.history = new Array(maxHistory);
    this.maxHistory = maxHistory;
    this.hHead = 0;
    this.hCurr = 0;
    this.hTail = 0;
  }

  apply(actions: Action[]) {
    for (const action of actions) {
      this.value = action.apply(this.value);
    }
    // Push to history
    this.history[this.hCurr] = actions;
    this.hCurr = (this.hCurr + 1) % this.maxHistory;
    // If there was undid histories, remove all of them
    this.hHead = this.hCurr;
    // Move tail if stack is full
    if (this.hHead === this.hTail) {
      this.hTail = (this.hTail + 1) % this.maxHistory;
    }
  }

  insert(path: jh.JsonPath, value: jh.Json) {
    return this.apply([new InsertAction(path, value)]);
  }

  delete(path: jh.JsonPath) {
    return this.apply([new DeleteAction(path)]);
  }

  update(path: jh.JsonPath, value: jh.Json) {
    return this.apply([new UpdateAction(path, value)]);
  }

  undoable() {
    return this.hCurr !== this.hTail;
  }

  undo() {
    if (!this.undoable()) {
      return false;
    }
    this.hCurr = (this.hCurr + this.maxHistory - 1) % this.maxHistory;
    const actions = this.history[this.hCurr];
    // Loop inverse order
    for (let i = actions.length - 1; i >= 0; i--) {
      this.value = actions[i].inverse().apply(this.value);
    }
    return true;
  }

  redoable() {
    return this.hCurr !== this.hHead;
  }

  redo() {
    if (!this.redoable()) {
      return false;
    }
    const actions = this.history[this.hCurr];
    for (const action of actions) {
      this.value = action.apply(this.value);
    }
    this.hCurr = (this.hCurr + 1) % this.maxHistory;
    return true;
  }

  historySize() {
    if (this.hHead <= this.hTail) {
      return this.hHead + this.maxHistory - this.hTail;
    } else {
      return this.hHead - this.hTail;
    }
  }
}
