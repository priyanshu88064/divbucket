import { createSelector } from "@reduxjs/toolkit";
import { editorRegistry } from "@core/kernel/bootstrap";
import { createTemplate } from "@core/utils/template";
import { IoMdAdd } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  addNode,
  updateActivePageId,
  updatePageOpenStatus,
} from "@core/state/reducers/treeReducer";
import {
  selectActivePageId,
  selectDocumentState,
  selectPageOpenMap,
  selectRootNames,
  selectTabs,
} from "@core/state/selectors/treeSelectors";
import type { AppDispatch } from "@core/state/store";
import styles from "./tabsection.module.css";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

const selectVisibleTabs = createSelector(
  selectTabs,
  selectPageOpenMap,
  (tabs, pageOpenMap) => tabs.filter((tab) => pageOpenMap[tab]),
);

const buildNextPageName = (names: string[]) => {
  let candidate = "Untitled";
  if (!names.includes(candidate)) return candidate;
  let index = 2;
  while (names.includes(`Untitled ${index}`)) {
    index += 1;
  }
  return `Untitled ${index}`;
};

export default function TabSection() {
  useRenderCounter("TabSection");
  const tabs = useSelector(selectVisibleTabs, shallowEqual);
  const activePageId = useSelector(selectActivePageId);
  const tabsName = useSelector(selectRootNames, shallowEqual);
  const treeState = useSelector(selectDocumentState);
  const dispatch = useDispatch<AppDispatch>();
  const closeTab = (pageId: number) => {
    dispatch(updatePageOpenStatus({ pageId, isOpen: false }));
  };

  const addPage = () => {
    const existingNames = Object.values(tabsName);
    const child = createTemplate({
      type: "core:page",
      name: buildNextPageName(existingNames),
      dispatch,
      treeState,
      registry: editorRegistry,
    });
    dispatch(addNode({ parent: -1, child }));
    dispatch(updateActivePageId({ pageId: child }));
  };

  return (
    <div className="h-8 border-b border-[var(--wb_border)] bg-[var(--wb_canvas_bar)] flex items-center px-2 gap-2 select-none z-[5]">
      <div className={`flex min-w-0 overflow-x-auto gap-1 ${styles.tabwrap}`}>
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => dispatch(updateActivePageId({ pageId: tab }))}
            onMouseDown={(event) => {
              if (event.button !== 1) return;
              event.preventDefault();
              event.stopPropagation();
              closeTab(tab);
            }}
            className={`
              group px-2 h-6 rounded-sm text-[11px] flex items-center gap-1 border
              ${tab === activePageId ? "bg-[var(--wb_surface_2)] border-[var(--wb_border_highlight)] text-[var(--wb_text)]" : "bg-transparent border-transparent text-[var(--wb_text_dim)] hover:bg-[var(--wb_surface_1)] hover:text-[var(--wb_text)]"}
            `}
          >
            <span className="truncate max-w-[160px]">{tabsName[tab]}</span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                closeTab(tab);
              }}
              className="opacity-70 group-hover:opacity-100"
            >
              <IoIosClose size={13} />
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        title="New page"
        onClick={addPage}
        className="h-6 w-6 shrink-0 rounded-sm border border-transparent text-[var(--wb_text_muted)] hover:text-[var(--wb_text)] hover:border-[var(--wb_border)] flex items-center justify-center"
      >
        <IoMdAdd size={14} />
      </button>
    </div>
  );
}
