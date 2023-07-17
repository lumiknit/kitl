// JSON Helpers

import {
  fa1,
  faCircle,
  faCircleCheck,
  faCircleXmark,
  faListOl,
  faQuoteLeft,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type Json = null | boolean | number | string | JsonArray | JsonObject;
export type JsonKey = number | string;
export type JsonPath = JsonKey[];

export const pathToString = (path: JsonPath) => {
  const reversed = path.slice().reverse();
  return reversed.join(" < ");
};

export const NUMBER_OF_TYPES = 7;
export enum JsonType {
  NULL = 0,
  FALSE = 1,
  TRUE = 2,
  NUMBER = 3,
  STRING = 4,
  ARRAY = 5,
  OBJECT = 6,
}

export const jsonTypesShort = [0, 3, 4, 5, 6];

export const jsonTypes = [
  "null",
  "false",
  "true",
  "number",
  "string",
  "array",
  "object",
];

export const jsonTypeSymbols = ["N", "F", "T", "123", '"', "[]", "{}"];

export const jsonTypeIcons = [
  faCircle, // Null
  faCircleXmark, // False
  faCircleCheck, // True
  fa1, // Number
  faQuoteLeft, // String
  faListOl, // Array
  faTableList, // Object
];

export const jsonTypeOf = (value: Json): JsonType => {
  if (value === null) {
    return JsonType.NULL;
  }
  switch (typeof value) {
    case "boolean":
      return value ? JsonType.TRUE : JsonType.FALSE;
    case "number":
      return JsonType.NUMBER;
    case "string":
      return JsonType.STRING;
    case "object":
      if (Array.isArray(value)) {
        return JsonType.ARRAY;
      }
      return JsonType.OBJECT;
    default:
      throw new Error(`Unknown type: ${typeof value}`);
  }
};

export const isObject = (value: Json): boolean =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export const emptyJsonValueOfType = (type: JsonType) => {
  switch (type) {
    case JsonType.FALSE:
      return false;
    case JsonType.TRUE:
      return true;
    case JsonType.NUMBER:
      return 0;
    case JsonType.STRING:
      return "";
    case JsonType.ARRAY:
      return [];
    case JsonType.OBJECT:
      return {};
    default:
      return null;
  }
};

export const updateJsonValue = (parent: Json, key: JsonKey, value: Json) => {
  if (Array.isArray(parent)) {
    if (typeof key === "number") {
      parent[key] = value;
    }
    return;
  } else if (typeof parent === "object" && parent !== null) {
    parent[key] = value;
  }
};

export const longRandom = () => {
  const a = Math.random().toString(36).slice(2);
  const b = Math.random().toString(36).slice(2);
  return `${a}${b}`;
};

export const nextJsonKey = (parent: Json): JsonKey => {
  if (Array.isArray(parent)) {
    return parent.length;
  } else if (typeof parent === "object" && parent !== null) {
    // Generate a key preventing collision
    let key;
    do {
      key = longRandom();
    } while (Object.prototype.hasOwnProperty.call(parent, key));
    return key;
  } else {
    return 0;
  }
};

const indentColorNum = 6;

export const jsonBtnDepthClass = (depth: number) => {
  const d = (depth + indentColorNum) % indentColorNum;
  return `json-btn-depth-${d}`;
};

export const jsonBtnOutlineDepthClass = (depth: number) => {
  const d = (depth + indentColorNum) % indentColorNum;
  return `json-btn-outline-depth-${d}`;
};

export const jsonCollectionEllipsisClass = (depth: number) => {
  const d = (depth + indentColorNum) % indentColorNum;
  return `json-value-collection-ellipsis-${d}`;
};

export const jsonCollectionBorderClass = (depth: number) => {
  const d = (depth + indentColorNum) % indentColorNum;
  return `json-value-collection-border-${d}`;
};

// String escapes

export const escapeString = (str: string) => {
  const escaped = JSON.stringify(str).slice(1, -1);
  // Change escaped quotes to single quotes
  return escaped.replace('\\"', '"');
};

export const unescapeString = (str: string) => {
  // Change quotes to escaped quotes
  const quoteEscaped = str.replace('"', '\\"');
  const newlineEscaped = quoteEscaped.replace("\n", "\\n");
  // Check if escape matched correctly
  let i = 0;
  for (; i < newlineEscaped.length; i++) {
    if (newlineEscaped[i] === "\\") {
      i++;
    }
  }
  if (i > newlineEscaped.length) {
    // Append one more backslash
    return JSON.parse(`"${newlineEscaped}\\"`);
  } else {
    return JSON.parse(`"${newlineEscaped}"`);
  }
};

// Position Helper

export class Position {
  depth: number;
  index: number | string;
  path: string;

  constructor(depth: number, index: number | string, path: string) {
    this.depth = depth;
    this.index = index;
    this.path = path;
  }

  child(childIndex: number | string) {
    return new Position(
      this.depth + 1,
      childIndex,
      this.path.length > 0 ? `${childIndex} < ${this.path}` : `${childIndex}`,
    );
  }
}
