import { useEffect } from "react";
import type { ReactNode } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaCss3, FaHome, FaImage, FaRegSquare, FaVideo } from "react-icons/fa";
import { LuHeading1, LuPanelRight, LuPanelRightClose } from "react-icons/lu";
import { IoText } from "react-icons/io5";
import { BsTextParagraph } from "react-icons/bs";
import { changeTab } from "@core/state/reducers/focusReducer";
import type { AppDispatch, RootState } from "@core/state/store";
import Empty from "./components/Empty";
import EditPanelHost from "./tabs/EditPanelHost";
import CssTab from "./tabs/CssTab/CssTab";
import {
  setRightInspectorTab,
  toggleRightDockOpen,
  type RightInspectorTab,
} from "@core/state/reducers/workbenchReducer";
import { selectNodeRecordById } from "@core/state/selectors/treeSelectors";

export const GetIconOfType = (type: string, size?: number) => {
  switch (type) {
    case "core:root":
      return <FaHome size={size || 12} />;
    case "core:container":
      return <FaRegSquare size={size || 12} />;
    case "core:row":
      return <FaRegSquare size={size || 12} />;
    case "core:heading":
      return <LuHeading1 size={size || 12} />;
    case "core:text":
      return <IoText size={size || 12} />;
    case "core:paragraph":
      return <BsTextParagraph size={size || 12} />;
    case "core:image":
      return <FaImage size={size || 12} />;
    case "core:video":
      return <FaVideo size={size || 12} />;
    default:
      return <FaHome size={size || 12} />;
  }
};

const inspectorTabs: Array<{
  id: RightInspectorTab;
  label: string;
  icon: ReactNode;
}> = [
  {
    id: "styles",
    label: "Styles",
    icon: <FaCss3 size={14} />,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <MdOutlineEdit size={14} />,
  },
];
const RIGHT_DOCK_WIDTH_PX = 350;

export default function Cssbar() {
  const tab = useSelector((state: RootState) => state.focusReducer.tab);
  const activeNodeId = useSelector(
    (state: RootState) => state.treeReducer.activeNodeId,
  );
  const activeNode = useSelector((state: RootState) =>
    activeNodeId ? selectNodeRecordById(state, activeNodeId) : undefined,
  );
  const rightDockOpen = useSelector(
    (state: RootState) => state.workbenchReducer.rightDockOpen,
  );
  const rightInspectorTab = useSelector(
    (state: RootState) => state.workbenchReducer.rightInspectorTab,
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const mappedTab = tab[0] === "0" ? "styles" : "settings";
    if (mappedTab !== rightInspectorTab) {
      dispatch(setRightInspectorTab({ tab: mappedTab }));
    }
  }, [dispatch, rightInspectorTab, tab]);

  return (
    <div
      style={{ width: rightDockOpen ? RIGHT_DOCK_WIDTH_PX : 42 }}
      className="z-[12] h-full text-white flex overflow-hidden bg-[var(--wb_surface_1)] border-l border-[var(--wb_border)]"
    >
      {!rightDockOpen && (
        <button
          title="Expand inspector"
          onClick={() => dispatch(toggleRightDockOpen())}
          className="w-full h-full flex items-start justify-center pt-3 text-[var(--wb_text_muted)] hover:text-[var(--wb_text)]"
          type="button"
        >
          <LuPanelRight size={16} />
        </button>
      )}

      {rightDockOpen && (
        <div className="w-full h-full flex flex-col relative">
          <div className="h-10 px-3 border-b border-[var(--wb_border)] flex items-center justify-between gap-2">
            <div className="min-w-0">
              {activeNode ? (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[var(--wb_text_dim)]">
                    {GetIconOfType(activeNode.type, 12)}
                  </span>
                  <div className="truncate text-[12px]">{activeNode.name}</div>
                </div>
              ) : (
                <div className="text-[var(--wb_text_dim)] text-[12px]">Inspector</div>
              )}
            </div>
            <button
              title="Collapse inspector"
              onClick={() => dispatch(toggleRightDockOpen())}
              className="text-[var(--wb_text_muted)] hover:text-[var(--wb_text)]"
              type="button"
            >
              <LuPanelRightClose size={14} />
            </button>
          </div>

          <div className="h-10 px-2 border-b border-[var(--wb_border)] flex items-center gap-1">
            {inspectorTabs.map((inspectorTab) => {
              const isActive = rightInspectorTab === inspectorTab.id;
              return (
                <button
                  key={inspectorTab.id}
                  onClick={() => {
                    dispatch(setRightInspectorTab({ tab: inspectorTab.id }));
                    dispatch(
                      changeTab({
                        tab: inspectorTab.id === "styles" ? "00" : "10",
                      }),
                    );
                  }}
                  className={`
                    h-7 px-2 rounded-sm border text-[11px] flex items-center gap-1
                    ${isActive ? "bg-[var(--wb_surface_2)] border-[var(--wb_border_highlight)] text-[var(--wb_text)]" : "border-transparent text-[var(--wb_text_dim)] hover:text-[var(--wb_text)] hover:border-[var(--wb_border)]"}
                  `}
                  type="button"
                >
                  {inspectorTab.icon}
                  {inspectorTab.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pb-24">
            {activeNodeId ? (
              rightInspectorTab === "styles" ? (
                <CssTab />
              ) : (
                <EditPanelHost id={activeNodeId} focus={tab[1]} />
              )
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
