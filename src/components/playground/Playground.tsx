import styles from "./playground.module.css";
import SideBar from "../../components/SideBar/SideBar";
import Cssbar from "../../components/Cssbar/Cssbar";
import TreeManager from "../../utils/TreeManager";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  updateActiveTab,
  updateBgContentRect,
  updateTabOpenStatus,
} from "../../store/reducers/treeReducer";
import { useEffect, useRef } from "react";
import { useDrag } from "../../hooks/useDrag";
import { IoIosClose } from "react-icons/io";
import { createSelector } from "@reduxjs/toolkit";
import useShortcuts from "../../hooks/useShortcuts";
import type { AppDispatch, RootState } from "../../store/store";

export default () => {
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );

  return (
    <div className="flex h-full w-full overflow-hidden bg-[var(--pg_bg)]">
      <SideBar />
      {activeTab && <JustAWrapper activeTab={activeTab} />}
      <Cssbar />
    </div>
  );
};

const JustAWrapper = ({ activeTab }: { activeTab: number }) => {
  const dispatch = useDispatch<AppDispatch>();
  const bgRef = useRef(null);
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  } = useDrag({ root: activeTab });
  useShortcuts();

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width, height, top, bottom, left, right } =
        entries[0].contentRect;
      dispatch(
        updateBgContentRect({
          bgContentRect: { width, height, top, bottom, left, right },
        }),
      );
    });
    if (bgRef && bgRef.current) observer.observe(bgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div
      ref={bgRef}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      className="bg-[var(--pg_bg)] flex-[1] flex flex-col overflow-hidden"
    >
      <Tabs />
      <TreeManager />
    </div>
  );
};

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

const Tabs = () => {
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
      className={`overflow-x-scroll flex gap-[6px] text-white text-xs cursor-default select-none p-[6px] ${styles.tabwrap}`}
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
};
