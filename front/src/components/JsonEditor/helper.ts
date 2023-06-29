// JSON Helpers

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
  "dash-circle-dotted", // NULL
  "exclamation-circle", // False
  "check-circle", // True
  "123", // Number
  "quote", // String
  "list-ol", // Array
  "braces", // Object
];

export const jsonTypeOf = (value: any): JsonType => {
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

export const updateJsonValue = (parent: any, key: JsonKey, value: any) => {
  parent[key] = value;
};

export const jsonBtnColorClass = (depth: number, outline?: boolean) => {
  const N = 7;
  if (outline) {
    return `json-btn-outline-depth-${depth % N}`;
  }
  return `json-btn-depth-${depth % N}`;
};
