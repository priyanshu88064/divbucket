import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../store/store";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  updateActiveTab,
  updateTabOpenStatus,
} from "../../../store/reducers/treeReducer";
import { IoIosClose } from "react-icons/io";
import styles from "./tabsection.module.css";

const selectTabsOpen = createSelector(
  (state: RootState) => state.treeReducer.dataMap,
  (dataMap) =>
    Object.fromEntries(
      Object.entries(dataMap)
        .filter((data) => data[1].type === "root")
        .map(([key, value]) => [key, value.open]),
    ),
);

const selectTabsName = createSelector(
  (state: RootState) => state.treeReducer.dataMap,
  (dataMap) =>
    Object.fromEntries(
      Object.entries(dataMap)
        .filter((data) => data[1].type === "root")
        .map(([key, value]) => [key, value.name]),
    ),
);

export default function TabSection() {
  const tabs = useSelector(
    (state: RootState) => state.treeReducer.tree[-1],
    shallowEqual,
  );
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );
  const tabsOpen = useSelector(selectTabsOpen, shallowEqual);
  const tabsName = useSelector(selectTabsName, shallowEqual);
  const dispatch = useDispatch();

  return (
    <div
      className={`overflow-x-scroll bg-[var(--pg_bg)] flex gap-[6px] text-white text-xs cursor-default select-none p-[6px] z-[3] ${styles.tabwrap}`}
    >
      {tabs
        .filter((tab) => tabsOpen[tab])
        .map((tab, ind) => (
          <div
            key={tab + ind + ""}
            onClick={() => dispatch(updateActiveTab({ tab }))}
            className={`
              px-[7px] py-[2px] text-[var(--text_2)] rounded-xs flex items-center gap-[5px] transition-[background] duration-100 hover:bg-[var(--bg_gray)]
              ${tab === activeTab ? "bg-[var(--bg_gray0)] text-white hover:bg-[var(--bg_gray0)]" : ""}
            `}
          >
            {tabsName[tab]}
            <IoIosClose
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(updateTabOpenStatus({ tab, open: false }));
              }}
              size={17}
            />
          </div>
        ))}
    </div>
  );
}
