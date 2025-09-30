import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState, type CSSProperties } from "react";
import { updateStyleMap } from "../../../store/reducers/treeReducer";
import styles from "../cssbar.module.css";
import type { CssState } from "../../../types/Tree";

export default function MPbox({
  prefix,
  cssState,
}: {
  prefix: string;
  cssState: CssState;
}) {
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);
  if (!id) return <></>;

  const [value, setValue] = useState({
    Top: "0",
    Left: "0",
    Bottom: "0",
    Right: "0",
  });

  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id][cssState],
  );
  const disptach = useDispatch<AppDispatch>();

  useEffect(() => {
    setValue({
      Top: (styleMap[(prefix + "Top") as keyof CSSProperties] as string) || "0",
      Right:
        (styleMap[(prefix + "Right") as keyof CSSProperties] as string) || "0",
      Bottom:
        (styleMap[(prefix + "Bottom") as keyof CSSProperties] as string) || "0",
      Left:
        (styleMap[(prefix + "Left") as keyof CSSProperties] as string) || "0",
    });
  }, [prefix, styleMap]);

  const updateStyle = (dir: string, value: string) => {
    disptach(
      updateStyleMap({
        id,
        style: { ...styleMap, [prefix + dir]: value },
        cssState,
      }),
    );
  };

  return (
    <div className={styles.padwrap}>
      <div
        className={styles.mpout}
        style={{
          boxShadow: prefix === "padding" ? "2px 2px 5px #00000070" : "",
          background: prefix === "padding" ? "#333C46" : "",
        }}
      >
        <div title="top" className={`${styles.mpcut} ${styles.top}`}>
          <input
            value={value.Top}
            placeholder="0"
            onFocus={(e) => e.target.select()}
            onBlur={() => updateStyle("Top", value.Top)}
            onKeyUp={(e) => {
              if (e.key === "Enter") updateStyle("Top", value.Top);
            }}
            onChange={(e) => setValue((f) => ({ ...f, Top: e.target.value }))}
            className={styles.mpcut0}
          />
        </div>
        <div title="right" className={`${styles.mpcut} ${styles.right}`}>
          <input
            value={value.Right}
            placeholder="0"
            onFocus={(e) => e.target.select()}
            onBlur={() => updateStyle("Right", value.Right)}
            onKeyUp={(e) => {
              if (e.key === "Enter") updateStyle("Right", value.Right);
            }}
            onChange={(e) => setValue((f) => ({ ...f, Right: e.target.value }))}
            className={styles.mpcut0}
          />
        </div>
        <div title="bottom" className={`${styles.mpcut} ${styles.bottom}`}>
          <input
            value={value.Bottom}
            placeholder="0"
            onFocus={(e) => e.target.select()}
            onBlur={() => updateStyle("Bottom", value.Bottom)}
            onKeyUp={(e) => {
              if (e.key === "Enter") updateStyle("Bottom", value.Bottom);
            }}
            onChange={(e) =>
              setValue((f) => ({ ...f, Bottom: e.target.value }))
            }
            className={styles.mpcut0}
          />
        </div>
        <div title="left" className={`${styles.mpcut} ${styles.left}`}>
          <input
            value={value.Left}
            placeholder="0"
            onFocus={(e) => e.target.select()}
            onBlur={() => updateStyle("Left", value.Left)}
            onKeyUp={(e) => {
              if (e.key === "Enter") updateStyle("Left", value.Left);
            }}
            onChange={(e) => setValue((f) => ({ ...f, Left: e.target.value }))}
            className={styles.mpcut0}
          />
        </div>
        <div
          className={styles.mpin}
          style={{
            boxShadow:
              prefix === "margin"
                ? "2px 2px 5px #00000070"
                : "inset 2px 2px 5px #00000070",
            background: prefix === "margin" ? "#333C46" : "#283037",
          }}
        ></div>
      </div>
    </div>
  );
}
