// Base JSON Types

export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type Json = null | boolean | number | string | JsonArray | JsonObject;
export type JsonKey = number | string;
export type JsonPath = JsonKey[];

// Json Type Enums

export enum JsonType {
  NULL = 0,
  FALSE,
  TRUE,
  NUMBER,
  STRING,
  ARRAY,
  OBJECT,
}
export const NUMBER_OF_TYPES = JsonType.OBJECT + 1;

export const JSON_TYPE_STRING = [
  "null",
  "false",
  "true",
  "number",
  "string",
  "array",
  "object",
];

export const typeOfJsonValue = (value: Json): JsonType => {
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

export const isJsonObject = (value: Json): boolean =>
  value !== null && typeof value === "object" && !Array.isArray(value);

// String escapes

export const escapeString = (value: string): string => {
  const v = JSON.stringify(value);
  const sliced = v.slice(1, v.length - 1);
  return sliced
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"');
};

export const unescapeString = (s: string): string => {
  // Count last backslash
  let i = s.length - 1;
  let backslashCount = 0;
  while (i >= 0 && s[i] === "\\") {
    backslashCount++;
    i--;
  }
  if (backslashCount % 2 === 1) {
    s = s + "\\";
  }
  s = s.replace(/"/g, '\\"');
  s = s.replace(/\n/g, "\\n");
  return JSON.parse(`"${s}"`);
};

// Formatters

export const formatJsonMin = (value: Json): string => JSON.stringify(value);
export const formatJsonPretty = (value: Json): string =>
  JSON.stringify(value, null, 2);

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
        const sep = ",\n" + " ".repeat(2 * (indentLevel + 1));
        const items = arr.map(item => formatJsonCompact(item, indentLevel + 1));
        return "[ " + items.join(sep) + " ]";
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
        const sep = ",\n" + " ".repeat(2 * (indentLevel + 1));
        const sepC = "\n" + " ".repeat(2 * (indentLevel + 2));
        const items = keys.map(key => {
          if (guessIsJsonLong(obj[key])) {
            return `${JSON.stringify(key)}:${sepC}${formatJsonCompact(
              obj[key],
              indentLevel + 2,
            )}`;
          } else {
            return `${JSON.stringify(key)}: ${formatJsonCompact(
              obj[key],
              indentLevel + 1,
            )}`;
          }
        });
        return "{ " + items.join(sep) + " }";
      }
  }
};
