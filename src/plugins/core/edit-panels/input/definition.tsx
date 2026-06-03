import type { NodeRecord } from "@core/types/document";
import type { EditPanelDefinition } from "@core/kernel/types";
import CheckBox from "@shared/ui/inputs/CheckBox";
import {
  INPUT_TYPE_OPTIONS,
  coerceInputPayload,
  withInputPayloadPatch,
  type InputTypeOption,
} from "@plugins/core/nodes/input/payload";
import styles from "@core/components/Cssbar/cssbar.module.css";

type InputNodeRecord = NodeRecord & {
  type: "custom:input";
  payload?: Record<string, unknown>;
};

const isInputNodeRecord = (record: NodeRecord): record is InputNodeRecord =>
  record.type === "custom:input";

export const INPUT_EDIT_PANEL_ID = "custom.input";

export const inputEditPanelDefinition: EditPanelDefinition = {
  id: INPUT_EDIT_PANEL_ID,
  component: ({
    draftRecord,
    setDraftRecord,
    commitDraftRecord,
    focus,
  }) => {
    if (!isInputNodeRecord(draftRecord)) {
      return null;
    }

    const payload = coerceInputPayload(draftRecord);
    const setInputPayload = (
      patch: Parameters<typeof withInputPayloadPatch>[1],
    ) => {
      const nextRecord = withInputPayloadPatch(draftRecord, patch);
      setDraftRecord(nextRecord);
      commitDraftRecord(nextRecord);
    };

    return (
      <div className={`${focus === "1" ? styles.edittab : ""}`}>
        <div
          className={`${styles.e0} ${styles.e0flex} ${focus === "2" ? styles.edittab : ""}`}
        >
          <input
            autoFocus={focus === "2"}
            value={draftRecord.name}
            className={styles.e0i}
            placeholder="Label"
            onBlur={() => commitDraftRecord()}
            onChange={(event) => {
              const nextRecord: NodeRecord = {
                ...draftRecord,
                name: event.target.value,
              };
              setDraftRecord(nextRecord);
            }}
          />
        </div>

        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>Input Type</div>
          <select
            className={styles.e0i}
            value={payload.inputType}
            onChange={(event) =>
              setInputPayload({
                inputType: event.target.value as InputTypeOption,
              })
            }
          >
            {INPUT_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>Placeholder</div>
          <input
            className={styles.e0i}
            value={payload.placeholder}
            onChange={(event) =>
              setInputPayload({ placeholder: event.target.value })
            }
          />
        </div>

        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>Default Value</div>
          <input
            className={styles.e0i}
            value={payload.value}
            onChange={(event) => setInputPayload({ value: event.target.value })}
          />
        </div>

        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>Field Name</div>
          <input
            className={styles.e0i}
            value={payload.name}
            onChange={(event) => setInputPayload({ name: event.target.value })}
          />
        </div>

        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>Validation</div>
          <CheckBox
            name="Required"
            checked={payload.required}
            onChange={(event) =>
              setInputPayload({ required: event.target.checked })
            }
          />
          <CheckBox
            name="Disabled"
            checked={payload.disabled}
            onChange={(event) =>
              setInputPayload({ disabled: event.target.checked })
            }
          />
        </div>
      </div>
    );
  },
};
