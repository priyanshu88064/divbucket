import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { useEffect, useState, type CSSProperties } from "react";
import {
  updateDataMap,
  updateStyleMap,
} from "../../../store/reducers/treeReducer";
import styles from "../cssbar.module.css";
import type { CssState, Joints } from "../../../types/Tree";
import { FaEquals } from "react-icons/fa";

type Dir = "Top" | "Right" | "Bottom" | "Left";

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
  const dataMap = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id],
  );
  const joints = dataMap.cssData?.joints?.[prefix as "margin" | "padding"];

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

  const updateStyle = (dir: Dir, value: string) => {
    let directionsToUpdate = { [prefix + dir]: value };

    if ((joints?.x && (dir === "Left" || dir === "Right")) || joints?.all) {
      directionsToUpdate[prefix + "Left"] = value;
      directionsToUpdate[prefix + "Right"] = value;
    }
    if ((joints?.y && (dir === "Top" || dir === "Bottom")) || joints?.all) {
      directionsToUpdate[prefix + "Top"] = value;
      directionsToUpdate[prefix + "Bottom"] = value;
    }

    disptach(
      updateStyleMap({
        id,
        style: { ...styleMap, ...directionsToUpdate },
        cssState,
      }),
    );
  };

  const updateData = (joints: Joints) => {
    if (!joints.x) delete joints.x;
    if (!joints.y) delete joints.y;
    if (!joints.all) delete joints.all;
    disptach(
      updateDataMap({
        id,
        data: {
          ...dataMap,
          cssData: {
            ...dataMap.cssData,
            joints: { ...dataMap.cssData?.joints, [prefix]: joints },
          },
        },
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
        {["Top", "Right", "Bottom", "Left"].map((dir, ind) => (
          <div
            key={"mpBox" + prefix + dir + ind}
            title={dir}
            className={`${styles.mpcut} ${styles[dir]}`}
          >
            <input
              value={value[dir as Dir]}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onBlur={() => updateStyle(dir as Dir, value[dir as Dir])}
              onKeyUp={(e) => {
                if (e.key === "Enter")
                  updateStyle(dir as Dir, value[dir as Dir]);
              }}
              onChange={(e) =>
                setValue((f) => ({ ...f, [dir]: e.target.value }))
              }
              className={styles.mpcut0}
            />
          </div>
        ))}

        <div
          className="relative h-[40px] flex items-center justify-center"
          style={{
            boxShadow:
              prefix === "margin"
                ? "2px 2px 5px #00000070"
                : "inset 2px 2px 5px #00000070",
            background: prefix === "margin" ? "#333C46" : "#283037",
          }}
        >
          <div
            onClick={() => {
              if (!joints?.x) updateStyle("Right", value.Left);
              updateData({ y: joints?.y, x: !joints?.x });
            }}
            className={`absolute top-1/2 -translate-y-1/2 w-full h-0.5 hover:h-2 rounded-sm cursor-pointer ${joints?.x ? "bg-blue-400" : "bg-gray-600"}`}
          ></div>
          <div
            onClick={() => {
              if (!joints?.y) updateStyle("Bottom", value.Top);
              updateData({ x: joints?.x, y: !joints?.y });
            }}
            className={`absolute left-1/2 -translate-x-1/2 h-full w-[3px] hover:w-2 rounded-sm cursor-pointer ${joints?.y ? "bg-blue-400" : "bg-gray-600"}`}
          ></div>
          <div
            onClick={() => {
              disptach(
                updateStyleMap({
                  id,
                  style: {
                    ...styleMap,
                    [prefix + "Right"]: value.Top,
                    [prefix + "Bottom"]: value.Top,
                    [prefix + "Left"]: value.Top,
                  },
                  cssState,
                }),
              );
              updateData({ all: !joints?.all });
            }}
            className={`z-10 px-2 py-[2px] ${prefix === "margin" ? "bg-[#333C46]" : "bg-[#283037]"} cursor-pointer rounded-sm ${joints?.all ? "!bg-blue-600 text-white" : "text-gray-400"}`}
          >
            <FaEquals />
          </div>
        </div>
      </div>
    </div>
  );
}
