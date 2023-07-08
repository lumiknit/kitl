// JSON Helpers

export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type Json = null | boolean | number | string | JsonArray | JsonObject;
export type JsonKey = number | string;
export type JsonPath = JsonKey[];

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
  "dash-square-dotted", // NULL
  "exclamation-diamond", // False
  "check-circle", // True
  "123", // Number
  "quote", // String
  "list-ol", // Array
  "braces", // Object
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

export const jsonBtnColorClass = (depth: number, outline?: boolean) => {
  const N = 6;
  if (outline) {
    return `json-btn-outline-depth-${depth % N}`;
  }
  return `json-btn-depth-${depth % N}`;
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
      this.path.length > 0 ? `${childIndex} < ${this.path}` : `${childIndex}`
    );
  }
}
