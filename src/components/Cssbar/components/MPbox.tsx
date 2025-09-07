import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { updateStyleMap } from "../../../store/reducers/treeReducer";
import styles from "../cssbar.module.css";

export default function MPbox({ prefix }: { prefix: string }) {
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);
  if (!id) return <>please fix this</>;

  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id],
  );
  const disptach = useDispatch<AppDispatch>();
  const [value, setValue] = useState({
    Top: "0",
    Right: "0",
    Bottom: "0",
    Left: "0",
  });

  useEffect(() => {
    setValue({
      Top:
        (styleMap[(prefix + "Top") as keyof React.CSSProperties] as string) ||
        "0",
      Right:
        (styleMap[(prefix + "Right") as keyof React.CSSProperties] as string) ||
        "0",
      Bottom:
        (styleMap[
          (prefix + "Bottom") as keyof React.CSSProperties
        ] as string) || "0",
      Left:
        (styleMap[(prefix + "Left") as keyof React.CSSProperties] as string) ||
        "0",
    });
  }, [id, styleMap]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (typeof Number(e.key) !== "number" && e.key !== "Backspace")
      e.preventDefault();
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();
  const onBlur = (dir: "Top" | "Right" | "Bottom" | "Left") => {
    let style = { ...styleMap };
    if (value[dir] === "" || value[dir] === "0")
      (style as any)[prefix + dir] = "0";
    else
      (style as any)[prefix + dir] =
        value[dir] + (typeof Number(value[dir]) !== "number") ? "" : "px";
    disptach(updateStyleMap({ id, style }));
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
            onChange={(e) => setValue((f) => ({ ...f, Top: e.target.value }))}
            onBlur={() => onBlur("Top")}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            className={styles.mpcut0}
            maxLength={4}
            placeholder="0"
            value={value.Top}
          />
        </div>
        <div title="right" className={`${styles.mpcut} ${styles.right}`}>
          <input
            onChange={(e) => setValue((f) => ({ ...f, Right: e.target.value }))}
            onBlur={() => onBlur("Right")}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            className={styles.mpcut0}
            maxLength={4}
            placeholder="0"
            value={value.Right}
          />
        </div>
        <div title="bottom" className={`${styles.mpcut} ${styles.bottom}`}>
          <input
            onChange={(e) =>
              setValue((f) => ({ ...f, Bottom: e.target.value }))
            }
            onBlur={() => onBlur("Bottom")}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            className={styles.mpcut0}
            maxLength={4}
            placeholder="0"
            value={value.Bottom}
          />
        </div>
        <div title="left" className={`${styles.mpcut} ${styles.left}`}>
          <input
            onChange={(e) => setValue((f) => ({ ...f, Left: e.target.value }))}
            onBlur={() => onBlur("Left")}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            className={styles.mpcut0}
            maxLength={4}
            placeholder="0"
            value={value.Left}
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
