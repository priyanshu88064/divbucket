import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import type { NodeData } from "../../../types/Tree";
import { updateDataMap } from "../../../store/reducers/treeReducer";
import { FaParagraph } from "react-icons/fa6";
import styles from "../cssbar.module.css";
import { FaLink } from "react-icons/fa";
import CheckBox from "../../../utils/inputs/CheckBox/CheckBox";

export default function EditTab({ id, focus }: { id: number; focus: string }) {
  const dataMap = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id],
  );
  const dispatch = useDispatch();
  const [data, setData] = useState<NodeData[number]>({
    name: "",
    type: "",
  });

  useEffect(() => {
    setData(dataMap);
  }, [dataMap]);

  function handleUpdate<K extends keyof NodeData[number]>(
    key: K,
    data: NodeData[number][K],
  ) {
    dispatch(updateDataMap({ id, data: { ...dataMap, [key]: data } }));
  }

  return (
    <div className={`${focus === "1" ? styles.edittab : ""}`}>
      {/* name */}
      <div
        className={`${styles.e0} ${styles.e0flex} ${focus === "2" ? styles.edittab : ""}`}
        style={{ marginTop: "10px" }}
      >
        <input
          autoFocus={focus === "2"}
          value={data.name}
          className={styles.e0i}
          onBlur={() => handleUpdate("name", data.name)}
          onChange={(e) => {
            setData((f) => ({ ...f, name: e.target.value }));
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleUpdate("name", data.name);
          }}
          onFocus={(e) => e.target.select()}
        />
      </div>

      {/* content */}
      {["Text", "Paragraph", "Heading", "Button"].includes(dataMap.type) && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            Content <FaParagraph />
          </div>
          <textarea
            value={data.content || ""}
            className={`${styles.e0i} ${styles.e0tarea}`}
            onBlur={() => handleUpdate("content", data.content)}
            onKeyUp={(e) => {
              if (e.key === "Enter")
                handleUpdate(
                  "content",
                  (e.target as HTMLTextAreaElement).value,
                );
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
            onChange={(e) => {
              setData((f) => ({ ...f, content: e.target.value }));
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {/* src */}
      {["Image", "Video"].includes(dataMap.type) && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            {dataMap.type} URL
            <FaLink size={10} />
          </div>
          <input
            value={data.media?.src || ""}
            className={styles.e0i}
            placeholder="https://picsum.photos/200"
            onBlur={() => handleUpdate("media", data.media)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleUpdate("media", data.media);
            }}
            onChange={(e) =>
              setData((f) => ({
                ...f,
                media: { ...f.media, src: e.target.value },
              }))
            }
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {/* alt */}
      {dataMap.type === "Image" && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            {dataMap.type} Alt
            <FaLink size={10} />
          </div>
          <input
            className={styles.e0i}
            value={data.media?.alt || ""}
            onBlur={() => handleUpdate("media", data.media)}
            onKeyUp={(e) => {
              if (e.key === "Enter") handleUpdate("media", data.media);
            }}
            onChange={(e) =>
              setData((f) => ({
                ...f,
                media: { ...f.media, alt: e.target.value },
              }))
            }
            onFocus={(e) => e.target.select()}
          />
        </div>
      )}

      {/* video settings */}
      {dataMap.type === "Video" && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>Additional</div>
          <CheckBox
            name={"Show controls"}
            checked={dataMap.media?.controls || false}
            onChange={(e) =>
              handleUpdate("media", {
                ...dataMap.media,
                controls: e.target.checked,
              })
            }
          />
          <CheckBox
            name={"Mute audio"}
            checked={dataMap.media?.muted || false}
            onChange={(e) =>
              handleUpdate("media", {
                ...dataMap.media,
                muted: e.target.checked,
              })
            }
          />
          <CheckBox
            name={"Loop"}
            checked={dataMap.media?.loop || false}
            onChange={(e) =>
              handleUpdate("media", {
                ...dataMap.media,
                loop: e.target.checked,
              })
            }
          />
          <CheckBox
            name={"Autoplay"}
            checked={dataMap.media?.autoPlay || false}
            onChange={(e) =>
              handleUpdate("media", {
                ...dataMap.media,
                autoPlay: e.target.checked,
              })
            }
          />
        </div>
      )}
    </div>
  );
}
