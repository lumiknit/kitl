import * as jh from './helper';

enum ActionType {
  Insert,
  Update,
  Delete,
}

const getJsonParent = (value: jh.Json, path: jh.JsonPath): jh.Json => {
  if(path.length === 0) {
    throw `There are no path!`;
  } else {
    for(let i = 0; i < path.length - 1; i++) {
      if(typeof value !== 'object' || value === null) {
        throw `Cannot access non-object value!`;
      }
      const idx = path[i];
      if(Array.isArray(value)) {
        if(typeof idx !== 'number') {
          throw `Cannot access non-number index of array!`;
        }
        value = value[idx];
      } else {
        if(typeof idx !== 'string') {
          throw `Cannot access non-string key of object!`;
        }
        value = value[idx];
      }
    }
    return value;
  }
};

const setJsonValue = (parent: jh.Json, key: jh.JsonKey, value: jh.Json) => {
  if(typeof parent !== 'object' || parent === null) {
    throw `Cannot access non-object parent!`;
  }
  if(Array.isArray(parent)) {
    if(typeof key !== 'number') {
      throw `Cannot access non-number index of array!`;
    }
    const oldValue = parent[key];
    parent[key] = value;
    return oldValue;
  } else {
    if(typeof key !== 'string') {
      throw `Cannot access non-string key of object!`;
    }
    const oldValue = parent[key];
    parent[key] = value;
    return oldValue;
  }
};

class Action {
  type: ActionType;
  path: jh.JsonPath;
  oldValue: jh.Json;
  value: jh.Json;

  constructor(type: ActionType, path: jh.JsonPath, value?: jh.Json, oldValue?: jh.Json) {
    this.type = type;
    this.path = path;
    if(value === undefined) value = null;
    this.value = value;
    if(oldValue === undefined) oldValue = null;
    this.oldValue = oldValue;
  }

  apply(json: jh.Json) {
    if(this.path.length === 0) {
      return this.value;
    }
    const parent = getJsonParent(json, this.path);
    const idx = this.path[this.path.length - 1];
    switch(this.type) {
      case ActionType.Insert:
        if(typeof parent !== 'object' || parent === null) {
          throw `Cannot access non-object parent!`;
        }
        if(Array.isArray(parent)) {
          if(typeof idx !== 'number') {
            throw `Cannot access non-number index of array!`;
          }
          parent.splice(idx, 0, this.value);
        } else {
          if(typeof idx !== 'string') {
            throw `Cannot access non-string key of object!`;
          }
          parent[idx] = this.value;
        }
        break;
      case ActionType.Update: {
        this.oldValue = setJsonValue(parent, idx, this.value);
      } break;
      case ActionType.Delete:
        if(typeof parent !== 'object' || parent === null) {
          throw `Cannot access non-object parent!`;
        }
        if(Array.isArray(parent)) {
          if(typeof idx !== 'number') {
            throw `Cannot access non-number index of array!`;
          }
          this.oldValue = parent.splice(idx, 1)[0];
        } else {
          if(typeof idx !== 'string') {
            throw `Cannot access non-string key of object!`;
          }
          this.oldValue = parent[idx];
          delete parent[idx];
        }
        break;
    }
    return json;
  }

  inverse() {
    let t = this.type;
    switch(t) {
      case ActionType.Insert:
        t = ActionType.Delete;
        break;
      case ActionType.Delete:
        t = ActionType.Insert;
        break;
    }
    return new Action(t, this.path, this.oldValue, this.value);
  }
}

export const insertAction = (path: jh.JsonPath, value: jh.Json) => {
  return new Action(ActionType.Insert, path, value);
};

export const updateAction = (path: jh.JsonPath, value: jh.Json) => {
  return new Action(ActionType.Update, path, value);
};

export const deleteAction = (path: jh.JsonPath) => {
  return new Action(ActionType.Delete, path);
};

export class JsonEdit {
  value: jh.Json;
  maxHistory: number;
  history: Action[][];
  hHead: number;
  hCurr: number;
  hTail: number;

  constructor(value: any, maxHistory = 128) {
    this.value = value;
    this.history = new Array(maxHistory);
    this.maxHistory = maxHistory;
    this.hHead = 0;
    this.hCurr = 0;
    this.hTail = 0;
  }

  apply(actions: Action[]) {
    for(const action of actions) {
      this.value = action.apply(this.value);
    }
    // Push to history
    this.history[this.hCurr] = actions;
    this.hCurr = (this.hCurr + 1) % this.maxHistory;
    // If there was undid histories, remove all of them
    this.hHead = this.hCurr;
    // Move tail if stack is full
    if(this.hHead === this.hTail) {
      this.hTail = (this.hTail + 1) % this.maxHistory;
    }
  }

  undo() {
    if(this.hCurr === this.hTail) {
      return false;
    }
    this.hCurr = (this.hCurr + this.maxHistory - 1) % this.maxHistory;
    const actions = this.history[this.hCurr];
    // Loop inverse order
    for(let i = actions.length - 1; i >= 0; i--) {
      actions[i].inverse().apply(this.value);
    }
    return true;
  }

  redo() {
    if(this.hCurr === this.hHead) {
      return false;
    }
    const actions = this.history[this.hCurr];
    for(const action of actions) {
      action.apply(this.value);
    }
    this.hCurr = (this.hCurr + 1) % this.maxHistory;
    return true;
  }

  historySize() {
    if(this.hHead <= this.hTail) {
      return this.hHead + this.maxHistory - this.hTail;
    } else {
      return this.hHead - this.hTail;
    }
  }
}
