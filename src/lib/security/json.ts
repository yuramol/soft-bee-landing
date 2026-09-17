type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export interface JsonObject {
  [key: string]: JsonValue;
}

export function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseJsonValue(raw: string): JsonValue {
  // JSON.parse is typed as any in TS lib; cast once then narrow at call sites.
  return JSON.parse(raw) as JsonValue;
}

export async function readResponseJson(response: Response): Promise<JsonValue> {
  // Response.json() is typed as any in DOM lib; cast once then narrow at call sites.
  return (await response.json()) as JsonValue;
}
