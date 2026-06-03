import type { NodeRecord } from "@core/types/document";
import {
  DEFAULT_ICON_ID,
  normalizeIconId,
} from "./catalog";

export interface IconPayload {
  iconId: string;
}

export const DEFAULT_ICON_PAYLOAD: IconPayload = {
  iconId: DEFAULT_ICON_ID,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const coerceIconPayload = (record: NodeRecord): IconPayload => {
  if (record.type !== "custom:icon" || !isRecord(record.payload)) {
    return DEFAULT_ICON_PAYLOAD;
  }

  const nextIconId =
    typeof record.payload.iconId === "string"
      ? record.payload.iconId
      : DEFAULT_ICON_PAYLOAD.iconId;

  return {
    iconId: normalizeIconId(nextIconId),
  };
};

export const withIconPayloadPatch = (
  record: NodeRecord,
  patch: Partial<IconPayload>,
): NodeRecord => {
  if (record.type !== "custom:icon") return record;

  const base = coerceIconPayload(record);
  return {
    ...record,
    payload: {
      ...base,
      ...patch,
    },
  };
};
