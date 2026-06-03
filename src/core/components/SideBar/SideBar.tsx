import { IoAddOutline, IoLayers } from "react-icons/io5";
import { useRef } from "react";
import type { ReactNode } from "react";
import Explorer from "./components/ExplorerTab";
import ElementsTab from "./components/ElementsTab";
import StatsForNerds from "../StatsForNerds/StatsForNerds";
import { LuPanelLeftClose } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@core/state/store";
import {
  LEFT_DOCK_MAX_WIDTH,
  LEFT_DOCK_MIN_WIDTH,
  setLeftDockOpen,
  setLeftDockTool,
  setLeftDockWidth,
  toggleLeftDockOpen,
  type LeftDockTool,
} from "@core/state/reducers/workbenchReducer";

const tabList: Array<{
  id: LeftDockTool;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "add",
    label: "Add",
    icon: <IoAddOutline size={18} />,
  },
  {
    id: "navigator",
    label: "Navigator",
    icon: <IoLayers size={16} />,
  },
];

export default () => {
  const dispatch = useDispatch<AppDispatch>();
  const leftDockOpen = useSelector(
    (state: RootState) => state.workbenchReducer.leftDockOpen,
  );
  const leftDockTool = useSelector(
    (state: RootState) => state.workbenchReducer.leftDockTool,
  );
  const leftDockWidth = useSelector(
    (state: RootState) => state.workbenchReducer.leftDockWidth,
  );
  const debugPanelOpen = useSelector(
    (state: RootState) => state.workbenchReducer.debugPanelOpen,
  );
  const resizingRef = useRef(false);

  const handleTabClick = (tool: LeftDockTool) => {
    if (!leftDockOpen) {
      dispatch(setLeftDockOpen({ isOpen: true }));
      dispatch(setLeftDockTool({ tool }));
      return;
    }
    if (leftDockTool === tool) {
      dispatch(toggleLeftDockOpen());
      return;
    }
    dispatch(setLeftDockTool({ tool }));
  };

  const handleResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    resizingRef.current = true;
    const startX = event.clientX;
    const startWidth = leftDockWidth;

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!resizingRef.current) return;
      const nextWidth = Math.min(
        LEFT_DOCK_MAX_WIDTH,
        Math.max(LEFT_DOCK_MIN_WIDTH, startWidth + (moveEvent.clientX - startX)),
      );
      dispatch(setLeftDockWidth({ width: nextWidth }));
    };

    const onPointerUp = () => {
      resizingRef.current = false;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <>
      <div className="h-full text-white flex select-none relative z-[10] border-r border-[var(--wb_border)]">
        <div className="w-10 bg-[var(--wb_surface_0)] h-full p-1 flex flex-col gap-1">
          {tabList.map((toolTab) => (
            <div
              key={toolTab.id}
              title={toolTab.label}
              onClick={() => handleTabClick(toolTab.id)}
              className={`
              flex items-center justify-center h-8 w-8 rounded-sm cursor-pointer border border-transparent
              text-[var(--wb_text_muted)] hover:text-[var(--wb_text)] hover:border-[var(--wb_border_highlight)]
              ${leftDockOpen && leftDockTool === toolTab.id ? "bg-[var(--wb_surface_2)] border-[var(--wb_border)] text-[var(--wb_text)]" : ""}
            `}
            >
              {toolTab.icon}
            </div>
          ))}
        </div>

        {leftDockOpen && (
          <div
            style={{ width: leftDockWidth }}
            className="relative bg-[var(--wb_surface_1)] text-xs flex flex-col"
          >
            <div className="h-10 px-4 border-b border-[var(--wb_border)] flex items-center justify-between uppercase tracking-[0.08em] text-[10px] text-[var(--wb_text_muted)]">
              <div>{leftDockTool === "add" ? "Add Elements" : "Navigator"}</div>
              <button
                onClick={() => dispatch(toggleLeftDockOpen())}
                className="text-[var(--wb_text_muted)] hover:text-[var(--wb_text)]"
                type="button"
              >
                <LuPanelLeftClose size={14} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              {leftDockTool === "add" ? <ElementsTab /> : <Explorer />}
            </div>
            <div
              onPointerDown={handleResizeStart}
              className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-[var(--wb_border_highlight)]"
            />
          </div>
        )}
      </div>

      {/* place it somewhere better */}
      {debugPanelOpen && <StatsForNerds />}
    </>
  );
};
