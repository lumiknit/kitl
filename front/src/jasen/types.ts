export type JArray = Value[];
export type JObject = { [key: string]: Value };
export type Value = null | boolean | number | string | JArray | JObject;
export type Key = number | string;
