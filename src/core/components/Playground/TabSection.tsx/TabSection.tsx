import { createSelector } from "@reduxjs/toolkit";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  updateActivePageId,
  updatePageOpenStatus,
} from "@core/state/reducers/treeReducer";
import { IoIosClose } from "react-icons/io";
import styles from "./tabsection.module.css";
import {
  selectActivePageId,
  selectPageOpenMap,
  selectRootNames,
  selectTabs,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
const selectVisibleTabs = createSelector(
  selectTabs,
  selectPageOpenMap,
  (tabs, pageOpenMap) => tabs.filter((tab) => pageOpenMap[tab]),
);

export default function TabSection() {
  useRenderCounter("TabSection");
  const tabs = useSelector(selectVisibleTabs, shallowEqual);
  const activePageId = useSelector(selectActivePageId);
  const tabsName = useSelector(selectRootNames, shallowEqual);
  const dispatch = useDispatch();

  return (
    <div
      className={`overflow-x-scroll bg-[var(--pg_bg)] flex gap-[6px] text-white text-xs cursor-default select-none p-[6px] z-[3] ${styles.tabwrap}`}
    >
      {tabs.map((tab, ind) => (
          <div
            key={tab + ind + ""}
            onClick={() => dispatch(updateActivePageId({ pageId: tab }))}
            className={`
              px-[7px] py-[2px] text-[var(--text_2)] rounded-xs flex items-center gap-[5px] transition-[background] duration-100 hover:bg-[var(--bg_gray)]
              ${tab === activePageId ? "bg-[var(--bg_gray0)] text-white hover:bg-[var(--bg_gray0)]" : ""}
            `}
          >
            {tabsName[tab]}
            <IoIosClose
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                dispatch(updatePageOpenStatus({ pageId: tab, isOpen: false }));
              }}
              size={17}
            />
          </div>
        ))}
    </div>
  );
}
