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

export const escapeString = (value: string): string => {
  const v = JSON.stringify(value);
  const sliced = v.slice(1, v.length - 1);
  return sliced.replace("\\n", "\n").replace("\\t", "\t").replace('\\"', '"');
};

const guessIsJsonLong = (value: Json): boolean => {
  switch (typeof value) {
    case "boolean":
    case "number":
      return false;
    case "string":
      return value.length > 20;
    case "object":
      if (value === null) {
        return false;
      } else if (Array.isArray(value)) {
        return value.length > 1;
      } else {
        return Object.keys(value).length > 1;
      }
  }
};

export const formatJsonMin = (value: Json): string =>
  JSON.stringify(value);
export const formatJsonPretty = (value: Json): string =>
  JSON.stringify(value, null, 2);

export const formatJsonCompact = (
  value: Json,
  indentLevel: number = 0,
): string => {
  switch (typeof value) {
    case "boolean":
    case "number":
    case "string":
      return JSON.stringify(value);
    case "object":
      if (value === null) {
        return "null";
      } else if (Array.isArray(value)) {
        const arr = value;
        if (arr.length === 0) {
          return "[]";
        } else if (arr.length === 1) {
          return `[${formatJsonCompact(arr[0], indentLevel + 1)}]`;
        }
        let s = "[ ";
        const sep = ",\n" + " ".repeat(2 * (indentLevel + 1));
        for (let i = 0; i < arr.length; i++) {
          if (i > 0) {
            s += sep;
          }
          s += formatJsonCompact(arr[i], indentLevel + 1);
        }
        s += " ]";
        return s;
      } else {
        const obj = value;
        const keys = Object.keys(obj);
        if (keys.length === 0) {
          return "{}";
        } else if (keys.length === 1) {
          return `{${JSON.stringify(keys[0])}: ${formatJsonCompact(
            obj[keys[0]],
            indentLevel + 1,
          )}}`;
        }
        let s = "{ ";
        const sep = ",\n" + " ".repeat(2 * (indentLevel + 1));
        const sepC = "\n" + " ".repeat(2 * (indentLevel + 2));
        for (let i = 0; i < keys.length; i++) {
          if (i > 0) {
            s += sep;
          }

          if (guessIsJsonLong(obj[keys[i]])) {
            s += `${JSON.stringify(keys[i])}:${sepC}${formatJsonCompact(
              obj[keys[i]],
              indentLevel + 2,
            )}`;
          } else {
            s += `${JSON.stringify(keys[i])}: ${formatJsonCompact(
              obj[keys[i]],
              indentLevel + 1,
            )}`;
          }
        }
        s += " }";
        return s;
      }
  }
};
