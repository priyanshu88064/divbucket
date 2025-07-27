import React from "react";
import styles from "./contextmenu.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  copy,
  cut,
  deleteNode,
  duplicate,
  paste,
  revealParent,
} from "../../store/reducers/treeReducer";
import { changeTab } from "../../store/reducers/focusReducer";
import type { RootState } from "../../store/store";

export default ({
  id,
  points,
  sidebar,
  setClicked,
}: {
  id: number;
  points: {
    x: number;
    y: number;
  };
  sidebar?: boolean;
  setClicked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const dispatch = useDispatch();
  const bgHeight = useSelector(
    (state: RootState) => state.treeReducer.bgContentRect.height,
  );
  const bgTop = useSelector(
    (state: RootState) => state.treeReducer.bgContentRect.top,
  );
  const type = useSelector(
    (state: RootState) => state.treeReducer.dataMap[id].type,
  );

  const list = sidebar
    ? [
        [
          {
            name: "Cut",
            command: "Ctrl + X",
            isOff: type === "root",
            func: () => {
              dispatch(cut());
            },
          },
          {
            name: "Copy",
            command: "Ctrl + C",
            isOff: type === "root",
            func: () => {
              dispatch(copy());
            },
          },
          {
            name: "Paste",
            command: "Ctrl + V",
            func: () => {
              dispatch(paste());
            },
          },
        ],
        [
          {
            name: "Duplicate",
            command: "Ctrl + D",
            isOff: type === "root",
            func: () => {
              dispatch(duplicate());
            },
          },
          {
            name: "Rename",
            func: () => {
              dispatch(changeTab({ tab: "12" }));
            },
          },
          {
            name: "Delete",
            func: () => {
              dispatch(deleteNode({ id }));
            },
            isOff: type === "root",
          },
        ],
      ]
    : [
        [
          {
            name: "Cut",
            command: "Ctrl + X",
            isOff: type === "root",
            func: () => {
              dispatch(cut());
            },
          },
          {
            name: "Copy",
            command: "Ctrl + C",
            isOff: type === "root",
            func: () => {
              dispatch(copy());
            },
          },
          {
            name: "Paste",
            command: "Ctrl + V",
            func: () => {
              dispatch(paste());
            },
          },
        ],
        [
          {
            name: "Duplicate",
            command: "Ctrl + D",
            isOff: type === "root",
            func: () => {
              dispatch(duplicate());
            },
          },
          {
            name: "Rename",
            func: () => {
              dispatch(changeTab({ tab: "12" }));
            },
          },
          {
            name: "Delete",
            func: () => {
              dispatch(deleteNode({ id }));
            },
            isOff: type === "root",
          },
        ],
        [
          {
            name: "Select Parent",
            command: "",
            isOff: type === "root",
            func: () => {
              dispatch(revealParent());
            },
          },
        ],
      ];
  return (
    <div
      className={styles.cover}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setClicked(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(false);
      }}
    >
      <div
        className={styles.contextmenu}
        style={{
          left: points.x,
          top: points.y,
          transform:
            points.y - bgTop > (bgHeight * 2) / 3 ? "translateY(-100%)" : "",
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {list.map((item, ind) => (
          <React.Fragment key={ind}>
            {item.map((subItem, sind) => (
              <div
                onClick={() => {
                  if (subItem.isOff) return;
                  subItem.func();
                  setClicked(false);
                }}
                key={"" + ind + sind}
                className={`${styles.cmitem} ${subItem.isOff && styles.cmitemoff}`}
              >
                <div className={styles.cmitem0}>{subItem.name}</div>
                <div className={styles.cmitem1}>{subItem.command}</div>
              </div>
            ))}
            {ind < list.length - 1 && <div className={styles.br}></div>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
