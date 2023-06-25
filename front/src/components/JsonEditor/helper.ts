// JSON Helpers

type JsonKey = number | string;
type JsonPath = JsonKey[];

const NUMBER_OF_TYPES = 7;
enum JsonType {
  NULL = 0,
  FALSE = 1,
  TRUE = 2,
  NUMBER = 3,
  STRING = 4,
  ARRAY = 5,
  OBJECT = 6,
}

const jsonTypes = [
  'null',
  'false',
  'true',
  'number',
  'string',
  'array',
  'object',
];

const jsonTypeSymbols = [
  'N',
  'F',
  'T',
  '123',
  '"',
  '[]',
  '{}',
];

const jsonTypeIcons = [
  "dash-circle-dotted", // NULL
  "exclamation-circle", // False
  "check-circle", // True
  "123", // Number
  "quote", // String
  "list-ol", // Array
  "braces", // Object
];

const jsonTypeOf = (value: any): JsonType => {
  if(value === null) {
    return JsonType.NULL;
  }
  switch(typeof value) {
    case 'boolean':
      return value ? JsonType.TRUE : JsonType.FALSE;
    case 'number':
      return JsonType.NUMBER;
    case 'string':
      return JsonType.STRING;
    case 'object':
      if (Array.isArray(value)) {
        return JsonType.ARRAY;
      }
      return JsonType.OBJECT;
    default:
      throw new Error(`Unknown type: ${typeof value}`);
  }
};

const emptyJsonValueOfType = (type: JsonType) => {
  switch (type) {
    case JsonType.FALSE:
      return false;
    case JsonType.TRUE:
      return true;
    case JsonType.NUMBER:
      return 0;
    case JsonType.STRING:
      return '';
    case JsonType.ARRAY:
      return [];
    case JsonType.OBJECT:
      return {};
    default:
      return null;
  }
};

const updateJsonValue = (
  parent: any,
  key: JsonKey,
  value: any,
) => {
  parent[key] = value;
};

export type {
  JsonKey,
  JsonPath,
};

// Edit mode

enum EditMode {
  Text = 0,
  Tree = 1,
  Select = 2,
}

const editModeLabels = [
  "Text",
  "Tree",
  "Select",
];

const editModeIcons = [
  "body-text",
  "view-stacked",
  "pencil-square",
];

const isTextMode = (mode: EditMode) => mode === EditMode.Text;

export {
  NUMBER_OF_TYPES,
  JsonType,
  jsonTypes,
  jsonTypeSymbols,
  jsonTypeIcons,
  jsonTypeOf,
  emptyJsonValueOfType,
  updateJsonValue,

  EditMode,
  editModeLabels,
  editModeIcons,
  isTextMode,
};