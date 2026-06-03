import type { NodeRecord } from "@core/types/document";
import type {
  EditPanelProps,
  NodeEditFieldKey,
} from "@core/kernel/types";
import { FaParagraph } from "react-icons/fa6";
import styles from "../cssbar.module.css";
import { FaLink } from "react-icons/fa";
import CheckBox from "@shared/ui/inputs/CheckBox";

type ContentNodeRecord = Extract<NodeRecord, { content: string }>;
type MediaNodeRecord = Extract<NodeRecord, { media: { src: string } }>;
type ImageNodeRecord = Extract<NodeRecord, { type: "core:image" }>;
type VideoNodeRecord = Extract<NodeRecord, { type: "core:video" }>;

const isContentNodeRecord = (
  node: NodeRecord,
): node is ContentNodeRecord => "content" in node;

const isMediaNodeRecord = (node: NodeRecord): node is MediaNodeRecord =>
  "media" in node;

const isImageNodeRecord = (node: NodeRecord): node is ImageNodeRecord =>
  node.type === "core:image";

const isVideoNodeRecord = (node: NodeRecord): node is VideoNodeRecord =>
  node.type === "core:video";

const hasField = (fields: NodeEditFieldKey[], fieldKey: NodeEditFieldKey) =>
  fields.includes(fieldKey);

export default function EditTab({
  focus,
  nodeDefinition,
  draftRecord,
  setDraftRecord,
  commitDraftRecord,
}: EditPanelProps) {
  const fields = nodeDefinition.edit?.fields || [];
  if (!fields.length) {
    return null;
  }

  const updateVideoFlag = (
    key: "controls" | "muted" | "loop" | "autoPlay",
    value: boolean,
  ) => {
    if (!isVideoNodeRecord(draftRecord)) return;
    const nextRecord: VideoNodeRecord = {
      ...draftRecord,
      media: {
        ...draftRecord.media,
        [key]: value,
      },
    };
    setDraftRecord(nextRecord);
    commitDraftRecord(nextRecord);
  };

  return (
    <div className={`${focus === "1" ? styles.edittab : ""}`}>
      {hasField(fields, "name") && (
        <div
          className={`${styles.e0} ${styles.e0flex} ${focus === "2" ? styles.edittab : ""}`}
        >
          <input
            autoFocus={focus === "2"}
            value={draftRecord.name}
            className={styles.e0i}
            onBlur={() => commitDraftRecord()}
            onChange={(e) => {
              const value = e.target.value;
              setDraftRecord((record) => ({ ...record, name: value }));
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") commitDraftRecord();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {hasField(fields, "content") && isContentNodeRecord(draftRecord) && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            Content <FaParagraph size={11} />
          </div>
          <textarea
            value={draftRecord.content}
            className={`${styles.e0i} ${styles.e0tarea}`}
            onBlur={() => commitDraftRecord()}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                commitDraftRecord({
                  ...draftRecord,
                  content: (e.target as HTMLTextAreaElement).value,
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            onChange={(e) => {
              const value = e.target.value;
              setDraftRecord((record) =>
                isContentNodeRecord(record) ? { ...record, content: value } : record,
              );
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {hasField(fields, "hyperlink") && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            Hyperlink
            <FaLink size={10} />
          </div>
          <input
            value={draftRecord.hyperlink || ""}
            className={styles.e0i}
            placeholder="https://example.com"
            onBlur={() => commitDraftRecord()}
            onKeyUp={(e) => {
              if (e.key === "Enter") commitDraftRecord();
            }}
            onChange={(e) => {
              const value = e.target.value;
              setDraftRecord((record) => ({ ...record, hyperlink: value }));
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {hasField(fields, "media.src") && isMediaNodeRecord(draftRecord) && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            {draftRecord.type} URL
            <FaLink size={10} />
          </div>
          <input
            value={draftRecord.media.src}
            className={styles.e0i}
            placeholder="https://picsum.photos/200"
            onBlur={() => commitDraftRecord()}
            onKeyUp={(e) => {
              if (e.key === "Enter") commitDraftRecord();
            }}
            onChange={(e) => {
              const value = e.target.value;
              setDraftRecord((record) =>
                isMediaNodeRecord(record)
                  ? {
                      ...record,
                      media: { ...record.media, src: value },
                    }
                  : record,
              );
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {hasField(fields, "media.alt") && isImageNodeRecord(draftRecord) && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            {draftRecord.type} Alt
            <FaLink size={10} />
          </div>
          <input
            className={styles.e0i}
            value={draftRecord.media.alt || ""}
            onBlur={() => commitDraftRecord()}
            onKeyUp={(e) => {
              if (e.key === "Enter") commitDraftRecord();
            }}
            onChange={(e) => {
              const value = e.target.value;
              setDraftRecord((record) =>
                isImageNodeRecord(record)
                  ? { ...record, media: { ...record.media, alt: value } }
                  : record,
              );
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {isVideoNodeRecord(draftRecord) &&
        (hasField(fields, "media.controls") ||
          hasField(fields, "media.muted") ||
          hasField(fields, "media.loop") ||
          hasField(fields, "media.autoPlay")) && (
          <div className={`${styles.e0} ${styles.e0flexcol}`}>
            <div className={styles.e00}>Additional</div>
            {hasField(fields, "media.controls") && (
              <CheckBox
                name="Show controls"
                checked={draftRecord.media.controls || false}
                onChange={(e) => updateVideoFlag("controls", e.target.checked)}
              />
            )}
            {hasField(fields, "media.muted") && (
              <CheckBox
                name="Mute audio"
                checked={draftRecord.media.muted || false}
                onChange={(e) => updateVideoFlag("muted", e.target.checked)}
              />
            )}
            {hasField(fields, "media.loop") && (
              <CheckBox
                name="Loop"
                checked={draftRecord.media.loop || false}
                onChange={(e) => updateVideoFlag("loop", e.target.checked)}
              />
            )}
            {hasField(fields, "media.autoPlay") && (
              <CheckBox
                name="Autoplay"
                checked={draftRecord.media.autoPlay || false}
                onChange={(e) => updateVideoFlag("autoPlay", e.target.checked)}
              />
            )}
          </div>
        )}
    </div>
  );
}
