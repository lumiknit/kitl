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