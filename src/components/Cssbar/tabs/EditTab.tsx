import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import type { NodeData } from "../../../types/Tree";
import { updateDataMap } from "../../../store/reducers/treeReducer";
import { FaParagraph } from "react-icons/fa6";
import styles from "../cssbar.module.css";
import { FaLink } from "react-icons/fa";

export default function EditTab({ focus }: { focus: string }) {
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);
  if (!id) return <>please fix this</>;

  const dataMap = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id],
  );
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: "",
    content: "",
    hyperlink: "",
    src: "",
    alt: "",
  });

  useEffect(() => {
    setData({
      name: dataMap.name || "",
      content: dataMap.content || "",
      hyperlink: dataMap.hyperlink || "",
      src: dataMap.src || "",
      alt: dataMap.alt || "",
    });
  }, [dataMap]);

  const handleText = (key: keyof NodeData[number], data: string) => {
    if (dataMap[key] !== data)
      dispatch(updateDataMap({ id, data: { ...dataMap, [key]: data } }));
  };

  return (
    <div className={`${focus === "1" ? styles.edittab : ""}`}>
      <div
        className={`${styles.e0} ${styles.e0flex} ${focus === "2" ? styles.edittab : ""}`}
        style={{ marginTop: "10px" }}
      >
        <input
          autoFocus={focus === "2"}
          value={data.name}
          className={styles.e0i}
          onBlur={() => handleText("name", data.name)}
          onChange={(e) => {
            setData((f) => ({ ...f, name: e.target.value }));
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") handleText("name", data.name);
          }}
          onFocus={(e) => e.target.select()}
        />
      </div>
      {["Text", "Paragraph", "Heading", "Button"].includes(dataMap.type) && (
        <div className={`${styles.e0} ${styles.e0flexcol}`}>
          <div className={styles.e00}>
            Content <FaParagraph />
          </div>
          <textarea
            value={data.content}
            className={`${styles.e0i} ${styles.e0tarea}`}
            onBlur={() => handleText("content", data.content)}
            onKeyUp={(e) => {
              if (e.key === "Enter")
                handleText("content", (e.target as HTMLTextAreaElement).value);
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
      {/* <div className={`${styles.e0} ${styles.e0flexcol}`}>
                <div className={styles.e00}>
                    Hyperlink
                    <FaLink size={10} />
                </div>
                <input
                    placeholder='www.google.com'
                    className={styles.e0i}
                    value={data.hyperlink}
                    onBlur={() => handleText("hyperlink", data.hyperlink)}
                    onKeyUp={e => {
                        if (e.key === "Enter") handleText("hyperlink", data.hyperlink);
                    }}
                    onChange={e => setData(f => ({ ...f, hyperlink: e.target.value }))}
                    onFocus={e => e.target.select()}
                />
                <CheckBox
                    name={"Open in a new tab"}
                    checked={dataMap.newTab}
                    onChange={e => handleText("newTab", e.target.checked)}
                />
            </div> */}
      {dataMap.type === "Image" && (
        <>
          <div className={`${styles.e0} ${styles.e0flexcol}`}>
            <div className={styles.e00}>
              Image URL
              <FaLink size={10} />
            </div>
            <input
              value={data.src}
              className={styles.e0i}
              placeholder="https://picsum.photos/200"
              onBlur={() => handleText("src", data.src)}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleText("src", data.src);
              }}
              onChange={(e) => setData((f) => ({ ...f, src: e.target.value }))}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className={`${styles.e0} ${styles.e0flexcol}`}>
            <div className={styles.e00}>
              Image Alt
              <FaLink size={10} />
            </div>
            <input
              className={styles.e0i}
              value={data.alt}
              onBlur={() => handleText("alt", data.alt)}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleText("alt", data.alt);
              }}
              onChange={(e) => setData((f) => ({ ...f, alt: e.target.value }))}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </>
      )}
    </div>
  );
}
