import { startTransition, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { FaHome, FaLaptop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { FaDownload, FaPlay } from "react-icons/fa6";
import { LuRedo2, LuUndo2 } from "react-icons/lu";
import { MdFullscreen, MdOutlineContentCopy } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { editorRegistry } from "@core/kernel/bootstrap";
import type { AppDispatch, RootState } from "@core/state/store";
import {
  copy,
  cut,
  deleteNode,
  duplicate,
  paste,
  revealParent,
  redo,
  undo,
  updatePageOpenStatus,
  updateRootWidth,
  addNode,
  updateActivePageId,
} from "@core/state/reducers/treeReducer";
import { preview } from "@core/state/reducers/previewReducer";
import {
  toggleDebugPanelOpen,
  toggleLeftDockOpen,
  toggleRightDockOpen,
} from "@core/state/reducers/workbenchReducer";
import { createTemplate } from "@core/utils/template";
import {
  detectCanvasViewportPreset,
  resolveEffectiveViewportWidth,
} from "@core/hooks/canvasSession";
import {
  selectActiveNodeId,
  selectActivePageId,
  selectDocumentState,
  selectNodeRecordById,
  selectRootNames,
  selectTabs,
  selectCanUndo,
  selectCanRedo,
} from "@core/state/selectors/treeSelectors";
import { useGenerateCode } from "@core/hooks/useGenerateCode";
import styles from "./headbar.module.css";

type MenuActionItem = {
  type: "item";
  label: string;
  shortcut?: string;
  disabled?: boolean;
  action: () => void;
};

type MenuSeparator = {
  type: "separator";
};

type MenuEntry = MenuActionItem | MenuSeparator;

type TopMenuConfig = {
  id: "file" | "edit" | "view" | "panels" | "export";
  label: string;
  items: MenuEntry[];
};

const buildNextPageName = (names: string[]) => {
  let candidate = "Untitled";
  if (!names.includes(candidate)) return candidate;
  let index = 2;
  while (names.includes(`Untitled ${index}`)) {
    index += 1;
  }
  return `Untitled ${index}`;
};

export default function Headbar() {
  const dispatch = useDispatch<AppDispatch>();
  const activePageId = useSelector(selectActivePageId);
  const activeNodeId = useSelector(selectActiveNodeId);
  const tabs = useSelector(selectTabs);
  const treeState = useSelector(selectDocumentState);
  const tabsName = useSelector(selectRootNames);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);
  const activeNodeType = useSelector((state: RootState) =>
    activeNodeId ? selectNodeRecordById(state, activeNodeId)?.type : null,
  );
  const requestedWidth = useSelector((state: RootState) => {
    if (!activePageId) return "100%";
    return state.treeReducer.nodeStyleMap[activePageId]?.default.width as
      | string
      | undefined;
  });
  const measuredAvailableWidth = useSelector((state: RootState) =>
    Math.floor(state.treeReducer.bgContentRect?.width || 0),
  );
  const [openMenuId, setOpenMenuId] = useState<TopMenuConfig["id"] | null>(null);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const menuRootRef = useRef<HTMLDivElement | null>(null);
  const stableAvailableWidthRef = useRef(0);

  useEffect(() => {
    if (measuredAvailableWidth > 1) {
      stableAvailableWidthRef.current = measuredAvailableWidth;
    }
  }, [measuredAvailableWidth]);

  const availableWidth =
    measuredAvailableWidth > 1
      ? measuredAvailableWidth
      : stableAvailableWidthRef.current;

  const activePreset = detectCanvasViewportPreset(requestedWidth || "100%");
  const viewportWidth = resolveEffectiveViewportWidth({
    requestedWidth: requestedWidth || "100%",
    availableWidth,
  });
  const canEditNode = Boolean(activeNodeId && activeNodeType !== "core:root");
  const canClosePage = Boolean(activePageId && tabs.length > 1);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRootRef.current) return;
      if (!menuRootRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const openPreview = () => {
    if (!activePageId) return;
    dispatch(
      preview({
        pageId: activePageId,
        viewportPreset: activePreset,
      }),
    );
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
    startTransition(() => {
      dispatch(addNode({ parent: -1, child }));
      dispatch(updateActivePageId({ pageId: child }));
    });
  };

  const closeActivePage = () => {
    if (!activePageId || !canClosePage) return;
    dispatch(updatePageOpenStatus({ pageId: activePageId, isOpen: false }));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      return;
    }
    if (document.exitFullscreen) document.exitFullscreen();
  };

  const menus: TopMenuConfig[] = [
    {
      id: "file",
      label: "File",
      items: [
        { type: "item", label: "New Page", shortcut: "Ctrl+N", action: addPage },
        {
          type: "item",
          label: "Close Active Page",
          shortcut: "Ctrl+W",
          disabled: !canClosePage,
          action: closeActivePage,
        },
        { type: "separator" },
        {
          type: "item",
          label: "Export HTML/CSS",
          shortcut: "Ctrl+E",
          action: () => setIsCodeOpen(true),
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      items: [
        {
          type: "item",
          label: "Undo",
          shortcut: "Ctrl+Z",
          disabled: !canUndo,
          action: () => dispatch(undo()),
        },
        {
          type: "item",
          label: "Redo",
          shortcut: "Ctrl+Shift+Z",
          disabled: !canRedo,
          action: () => dispatch(redo()),
        },
        { type: "separator" },
        { type: "item", label: "Cut", shortcut: "Ctrl+X", disabled: !canEditNode, action: () => dispatch(cut()) },
        { type: "item", label: "Copy", shortcut: "Ctrl+C", disabled: !canEditNode, action: () => dispatch(copy()) },
        { type: "item", label: "Paste", shortcut: "Ctrl+V", action: () => dispatch(paste()) },
        { type: "separator" },
        { type: "item", label: "Duplicate", shortcut: "Ctrl+D", disabled: !canEditNode, action: () => dispatch(duplicate()) },
        {
          type: "item",
          label: "Delete",
          shortcut: "Del",
          disabled: !canEditNode,
          action: () => {
            if (!activeNodeId) return;
            dispatch(deleteNode({ id: activeNodeId }));
          },
        },
        {
          type: "item",
          label: "Select Parent",
          disabled: !canEditNode,
          action: () => dispatch(revealParent()),
        },
      ],
    },
    {
      id: "view",
      label: "View",
      items: [
        { type: "item", label: "Preview", shortcut: "Ctrl+P", action: openPreview },
        { type: "item", label: "Fullscreen", shortcut: "F11", action: toggleFullscreen },
        { type: "separator" },
        {
          type: "item",
          label: "Mobile View (425px)",
          action: () => dispatch(updateRootWidth({ width: "425px" })),
        },
        {
          type: "item",
          label: "Tablet View (768px)",
          action: () => dispatch(updateRootWidth({ width: "768px" })),
        },
        {
          type: "item",
          label: "Desktop View (100%)",
          action: () => dispatch(updateRootWidth({ width: "100%" })),
        },
      ],
    },
    {
      id: "panels",
      label: "Panels",
      items: [
        { type: "item", label: "Toggle Left Panel", action: () => dispatch(toggleLeftDockOpen()) },
        { type: "item", label: "Toggle Right Inspector", action: () => dispatch(toggleRightDockOpen()) },
        { type: "item", label: "Toggle Debug Panel", action: () => dispatch(toggleDebugPanelOpen()) },
      ],
    },
    {
      id: "export",
      label: "Export",
      items: [
        { type: "item", label: "Open HTML/CSS Export", action: () => setIsCodeOpen(true) },
      ],
    },
  ];

  return (
    <div className="border-b border-[var(--wb_border)] bg-[var(--wb_surface_0)] text-[var(--wb_text)] z-[20]">
      <div
        ref={menuRootRef}
        className="h-8 px-3 flex items-center gap-1 border-b border-[var(--wb_border)] relative"
      >
        {menus.map((menu) => (
          <div key={menu.id} className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenMenuId((current) => (current === menu.id ? null : menu.id))
              }
              className={`
                h-6 px-2 rounded-sm text-[12px]
                ${openMenuId === menu.id ? "bg-[var(--wb_surface_2)] text-[var(--wb_text)]" : "text-[var(--wb_text_muted)] hover:text-[var(--wb_text)] hover:bg-[var(--wb_surface_1)]"}
              `}
            >
              {menu.label}
            </button>
            {openMenuId === menu.id && (
              <MenuDropdown
                items={menu.items}
                onSelect={() => setOpenMenuId(null)}
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            title="Undo (Ctrl/Cmd+Z)"
            disabled={!canUndo}
            onClick={() => dispatch(undo())}
            className={`
              h-6 w-6 rounded-sm border flex items-center justify-center
              ${canUndo ? "border-transparent text-[var(--wb_text_muted)] hover:text-[var(--wb_text)] hover:border-[var(--wb_border)]" : "border-transparent text-[var(--wb_text_dim)] opacity-50 cursor-not-allowed"}
            `}
          >
            <LuUndo2 size={12} />
          </button>
          <button
            type="button"
            title="Redo (Ctrl/Cmd+Shift+Z)"
            disabled={!canRedo}
            onClick={() => dispatch(redo())}
            className={`
              h-6 w-6 rounded-sm border flex items-center justify-center
              ${canRedo ? "border-transparent text-[var(--wb_text_muted)] hover:text-[var(--wb_text)] hover:border-[var(--wb_border)]" : "border-transparent text-[var(--wb_text_dim)] opacity-50 cursor-not-allowed"}
            `}
          >
            <LuRedo2 size={12} />
          </button>
          <div className="h-4 w-px bg-[var(--wb_border)] mx-1" />
          <ViewportButton
            icon={<FaMobileAlt size={11} />}
            title="Mobile viewport"
            active={activePreset === "mobile"}
            onClick={() => dispatch(updateRootWidth({ width: "425px" }))}
          />
          <ViewportButton
            icon={<FaTabletAlt size={11} />}
            title="Tablet viewport"
            active={activePreset === "tablet"}
            onClick={() => dispatch(updateRootWidth({ width: "768px" }))}
          />
          <ViewportButton
            icon={<FaLaptop size={11} />}
            title="Desktop viewport"
            active={activePreset === "desktop"}
            onClick={() => dispatch(updateRootWidth({ width: "100%" }))}
          />
          <div className="h-4 w-px bg-[var(--wb_border)] mx-1" />
          <div className="text-[10px] text-[var(--wb_text_dim)] min-w-[58px] text-right">
            {viewportWidth || 0}px
          </div>
          <button
            onClick={openPreview}
            className="h-6 px-2 rounded-sm border border-transparent text-[10px] tracking-wide text-[var(--wb_text)] hover:border-[var(--wb_border_highlight)] hover:bg-[var(--wb_surface_2)] flex items-center gap-1"
            type="button"
          >
            <FaPlay size={9} />
            PREVIEW
          </button>
          <button
            onClick={() => setIsCodeOpen(true)}
            className="h-6 px-2 rounded-sm border border-transparent text-[10px] tracking-wide text-[var(--wb_text)] hover:border-[var(--wb_border_highlight)] hover:bg-[var(--wb_surface_2)] flex items-center gap-1"
            type="button"
          >
            <FaDownload size={9} />
            HTML/CSS
          </button>
          <button
            onClick={toggleFullscreen}
            className="h-6 w-6 rounded-sm border border-transparent text-[var(--wb_text_muted)] hover:text-[var(--wb_text)] hover:border-[var(--wb_border)] flex items-center justify-center"
            type="button"
            title="Toggle fullscreen"
          >
            <MdFullscreen size={13} />
          </button>
        </div>
      </div>

      {isCodeOpen &&
        activePageId &&
        createPortal(
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/85 z-[35]"
            onClick={() => setIsCodeOpen(false)}
          >
            <div
              className="relative flex max-h-[560px] max-w-[860px] w-[92%] h-[92%] rounded-sm bg-[#1B2228] p-4 gap-2 text-xs text-[var(--wb_text)] border border-[var(--wb_border)]"
              onClick={(event) => event.stopPropagation()}
            >
              <Code />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function MenuDropdown({
  items,
  onSelect,
}: {
  items: MenuEntry[];
  onSelect: () => void;
}) {
  return (
    <div className="absolute top-[calc(100%+4px)] left-0 min-w-[220px] rounded-sm border border-[var(--wb_border)] bg-[var(--wb_surface_1)] shadow-[0_10px_24px_rgba(0,0,0,0.45)] py-1 z-[40]">
      {items.map((item, index) =>
        item.type === "separator" ? (
          <div key={`sep-${index}`} className="my-1 h-px bg-[var(--wb_border)]" />
        ) : (
          <button
            key={`${item.label}-${index}`}
            type="button"
            disabled={item.disabled}
            onClick={() => {
              if (item.disabled) return;
              item.action();
              onSelect();
            }}
            className="w-full px-3 py-1.5 text-left text-[11px] flex items-center justify-between gap-4 text-[var(--wb_text)] hover:bg-[var(--wb_surface_2)] disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <span>{item.label}</span>
            <span className="text-[10px] text-[var(--wb_text_dim)]">{item.shortcut}</span>
          </button>
        ),
      )}
    </div>
  );
}

function ViewportButton({
  icon,
  title,
  active,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        h-6 w-6 rounded-sm flex items-center justify-center border text-[var(--wb_text_muted)]
        ${active ? "bg-[var(--wb_surface_2)] border-[var(--wb_border_highlight)] text-[var(--wb_text)]" : "border-transparent hover:border-[var(--wb_border)] hover:text-[var(--wb_text)]"}
      `}
    >
      {icon}
    </button>
  );
}

const Code = () => {
  const tabs = useSelector(selectTabs);
  const dataMap = useSelector(
    (state: RootState) => state.treeReducer.nodeRecordMap,
  );
  const [activeCodeIndex, setActiveCodeIndex] = useState(0);
  const { generate } = useGenerateCode();

  const code = tabs.map((tab) => generate({ tab, isInternalStyleSheet: false }));
  const [isHtml, setIsHtml] = useState(true);
  const copiedRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        className={`${styles.codesidebar} w-[170px] rounded-sm p-2 overflow-y-scroll bg-[var(--wb_surface_1)] border border-[var(--wb_border)]`}
      >
        {tabs.map((tab, index) => (
          <button
            key={`${tab}-${index}`}
            className={`
              w-full flex items-center gap-2 p-2 text-left rounded-sm
              ${index === activeCodeIndex ? "bg-[var(--wb_surface_2)]" : ""}
            `}
            onClick={() => setActiveCodeIndex(index)}
            type="button"
          >
            <FaHome />
            <span className="truncate">{dataMap[tab].name}</span>
          </button>
        ))}
      </div>
      <div className={styles.codearea}>
        <div
          className={styles.codecopy}
          onClick={() => {
            if (isHtml) {
              navigator.clipboard.writeText(code[activeCodeIndex].html);
            } else {
              navigator.clipboard.writeText(code[activeCodeIndex].css);
            }
            if (copiedRef.current) copiedRef.current.style.visibility = "visible";
            setTimeout(() => {
              if (copiedRef.current) copiedRef.current.style.visibility = "hidden";
            }, 1000);
          }}
        >
          <MdOutlineContentCopy size={20} />
          <div style={{ visibility: "hidden" }} ref={copiedRef}>
            copied
          </div>
        </div>
        <div className={styles.catabs}>
          <div
            onClick={() => setIsHtml(true)}
            className={`${isHtml && styles.catabsactive}`}
          >
            HTML
          </div>
          <div
            onClick={() => setIsHtml(false)}
            className={`${!isHtml && styles.catabsactive}`}
          >
            CSS
          </div>
        </div>
        <textarea
          style={{ color: isHtml ? "orange" : "" }}
          value={
            isHtml
              ? code[activeCodeIndex].html
              : code[activeCodeIndex].css.length > 5000
                ? `${code[activeCodeIndex].css.substr(0, 5000)}\n...`
                : code[activeCodeIndex].css
          }
          readOnly
        />
        <div className={styles.codewarning}>
          Generated output can include temporary quirks while the editor is in
          active development.
        </div>
      </div>
    </>
  );
};
