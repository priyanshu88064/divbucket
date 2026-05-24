import type { NodeRecord } from "@core/types/document";

export const INPUT_TYPE_OPTIONS = [
  "text",
  "email",
  "password",
  "number",
  "tel",
  "url",
  "search",
] as const;

export type InputTypeOption = (typeof INPUT_TYPE_OPTIONS)[number];

export interface InputPayload {
  inputType: InputTypeOption;
  placeholder: string;
  value: string;
  name: string;
  required: boolean;
  disabled: boolean;
}

export const DEFAULT_INPUT_PAYLOAD: InputPayload = {
  inputType: "text",
  placeholder: "Type here...",
  value: "",
  name: "",
  required: false,
  disabled: false,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toStringValue = (value: unknown, fallback: string) =>
  typeof value === "string" ? value : fallback;

const toBooleanValue = (value: unknown, fallback: boolean) =>
  typeof value === "boolean" ? value : fallback;

export const coerceInputPayload = (record: NodeRecord): InputPayload => {
  if (record.type !== "custom:input" || !isRecord(record.payload)) {
    return DEFAULT_INPUT_PAYLOAD;
  }

  const nextInputType = toStringValue(
    record.payload.inputType,
    DEFAULT_INPUT_PAYLOAD.inputType,
  );

  const safeInputType = INPUT_TYPE_OPTIONS.includes(
    nextInputType as InputTypeOption,
  )
    ? (nextInputType as InputTypeOption)
    : DEFAULT_INPUT_PAYLOAD.inputType;

  return {
    inputType: safeInputType,
    placeholder: toStringValue(
      record.payload.placeholder,
      DEFAULT_INPUT_PAYLOAD.placeholder,
    ),
    value: toStringValue(record.payload.value, DEFAULT_INPUT_PAYLOAD.value),
    name: toStringValue(record.payload.name, DEFAULT_INPUT_PAYLOAD.name),
    required: toBooleanValue(
      record.payload.required,
      DEFAULT_INPUT_PAYLOAD.required,
    ),
    disabled: toBooleanValue(
      record.payload.disabled,
      DEFAULT_INPUT_PAYLOAD.disabled,
    ),
  };
};

export const withInputPayloadPatch = (
  record: NodeRecord,
  patch: Partial<InputPayload>,
): NodeRecord => {
  if (record.type !== "custom:input") return record;

  const base = coerceInputPayload(record);
  return {
    ...record,
    payload: {
      ...base,
      ...patch,
    },
  };
};
