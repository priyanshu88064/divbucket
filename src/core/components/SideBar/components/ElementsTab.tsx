import { editorRegistry } from "@core/kernel/bootstrap";
import { useDrag } from "@core/hooks/useDrag";
import { useDragState } from "@core/hooks/useDragState";
import {
  type ReactNode,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { PRESET_GROUPS } from "@plugins/core/presets/shared/groups";

const PALETTE_PRESET_GROUP_ORDER: string[] = [
  PRESET_GROUPS.components,
  PRESET_GROUPS.sections,
];

const formatSidebarName = (label: string) => {
  if (!label.startsWith("core:")) {
    return label;
  }

  return label
    .replace("core:", "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const registryElementItems = editorRegistry
  .listNodeTypes()
  .filter((definition) => definition.sidebar.visible && definition.sidebar.group === "Elements")
  .sort((a, b) => a.sidebar.order - b.sidebar.order)
  .map((definition) => ({
    id: definition.kind,
    icon: definition.icon(),
    name: formatSidebarName(definition.label),
  }));

const registryPresetGroups = editorRegistry
  .listPresets()
  .filter(
    (definition) =>
      definition.group !== PRESET_GROUPS.pages &&
      definition.group !== PRESET_GROUPS.elements,
  )
  .sort((a, b) => a.order - b.order)
  .reduce<
    {
      group: string;
      items: { id: string; icon: ReactNode; name: string }[];
    }[]
  >((groups, definition) => {
    const item = {
      id: definition.id,
      icon: definition.icon?.() || (
        <div className="border border-gray-500 rounded-sm px-2 py-0.5 text-xs uppercase">
          {definition.label.slice(0, 2)}
        </div>
      ),
      name: definition.label,
    };

    const existingGroup = groups.find((group) => group.group === definition.group);
    if (existingGroup) {
      existingGroup.items.push(item);
      return groups;
    }

    groups.push({ group: definition.group, items: [item] });
    return groups;
  }, [])
  .sort(
    (a, b) =>
      PALETTE_PRESET_GROUP_ORDER.indexOf(a.group) -
      PALETTE_PRESET_GROUP_ORDER.indexOf(b.group),
  );

const registryPaletteLaunchers = editorRegistry
  .listPaletteLaunchers()
  .filter((definition) => definition.group === "Elements")
  .sort((a, b) => a.order - b.order)
  .map((definition) => ({
    id: definition.id,
    name: formatSidebarName(definition.label),
    icon: definition.icon(),
    trigger: definition.trigger,
    surface: definition.surface || "inline",
    placement: definition.placement || "right-center",
    offset: definition.offset ?? 12,
    searchTokens: definition.searchTokens || [],
    renderPanel: definition.renderPanel,
  }));

const HOVER_PANEL_CLOSE_DELAY_MS = 260;
const POPOVER_VIEWPORT_PADDING_PX = 12;
const POPOVER_ARROW_SIZE_PX = 12;

export default function ElementsTab() {
  const { handlePointerDownCapture } = useDrag();
  const { isDragging, source } = useDragState();
  const [query, setQuery] = useState("");
  const [openLauncherId, setOpenLauncherId] = useState<string | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
    arrowTop: number;
  } | null>(null);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launcherElementMapRef = useRef(new Map<string, HTMLButtonElement | null>());
  const popoverPanelRef = useRef<HTMLDivElement | null>(null);

  const clearScheduledClose = () => {
    if (!closeTimerRef.current) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  const openPaletteLauncher = (launcherId: string) => {
    clearScheduledClose();
    setOpenLauncherId(launcherId);
  };

  const closeLauncher = (launcherId: string) => {
    setOpenLauncherId((current) =>
      current === launcherId ? null : current,
    );
  };

  const scheduleClose = (launcherId: string) => {
    clearScheduledClose();
    closeTimerRef.current = setTimeout(() => {
      closeLauncher(launcherId);
    }, HOVER_PANEL_CLOSE_DELAY_MS);
  };

  useEffect(
    () => () => {
      clearScheduledClose();
    },
    [],
  );

  const elementItems = registryElementItems.filter(
    (item) =>
      deferredQuery.length === 0 ||
      item.name.toLowerCase().includes(deferredQuery),
  );
  const launcherItems = registryPaletteLaunchers.filter((launcher) => {
    if (deferredQuery.length === 0) return true;
    if (launcher.name.toLowerCase().includes(deferredQuery)) return true;
    return launcher.searchTokens.some((token) =>
      token.toLowerCase().includes(deferredQuery),
    );
  });
  const activeLauncher = launcherItems.find(
    (launcher) => launcher.id === openLauncherId,
  );

  const registerLauncherElement = (
    launcherId: string,
    element: HTMLButtonElement | null,
  ) => {
    launcherElementMapRef.current.set(launcherId, element);
  };

  useEffect(() => {
    if (activeLauncher?.surface !== "popover") {
      setPopoverPosition(null);
    }
  }, [activeLauncher]);

  useEffect(() => {
    if (!activeLauncher || activeLauncher.surface !== "popover") return;
    if (!isDragging) return;
    if (source?.kind !== "palette") return;
    if (source.templateType !== "custom:icon") return;
    clearScheduledClose();
    setOpenLauncherId(null);
  }, [activeLauncher, isDragging, source]);

  useLayoutEffect(() => {
    if (!activeLauncher || activeLauncher.surface !== "popover") return;

    const updatePopoverPosition = () => {
      const anchorElement = launcherElementMapRef.current.get(activeLauncher.id);
      const popoverElement = popoverPanelRef.current;
      if (!anchorElement || !popoverElement) return;

      const anchorRect = anchorElement.getBoundingClientRect();
      const popoverRect = popoverElement.getBoundingClientRect();
      const offset = activeLauncher.offset ?? 12;
      const viewportHeight = window.innerHeight;

      let top =
        activeLauncher.placement === "right-start"
          ? anchorRect.top
          : anchorRect.top + anchorRect.height / 2 - popoverRect.height / 2;

      top = Math.max(
        POPOVER_VIEWPORT_PADDING_PX,
        Math.min(
          top,
          viewportHeight - popoverRect.height - POPOVER_VIEWPORT_PADDING_PX,
        ),
      );

      const anchorCenterY = anchorRect.top + anchorRect.height / 2;
      const arrowTop = Math.max(
        18,
        Math.min(
          anchorCenterY - top - POPOVER_ARROW_SIZE_PX / 2,
          popoverRect.height - 24,
        ),
      );

      setPopoverPosition({
        top,
        left: anchorRect.right + offset,
        arrowTop,
      });
    };

    updatePopoverPosition();

    window.addEventListener("resize", updatePopoverPosition);
    window.addEventListener("scroll", updatePopoverPosition, true);
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updatePopoverPosition())
        : null;
    if (resizeObserver && popoverPanelRef.current) {
      resizeObserver.observe(popoverPanelRef.current);
    }

    return () => {
      window.removeEventListener("resize", updatePopoverPosition);
      window.removeEventListener("scroll", updatePopoverPosition, true);
      resizeObserver?.disconnect();
    };
  }, [activeLauncher]);

  const presetGroups = registryPresetGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          deferredQuery.length === 0 ||
          item.name.toLowerCase().includes(deferredQuery),
      ),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-[var(--wb_surface_1)] px-3 pb-3 pt-3 border-b border-[var(--wb_border)]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search elements and layouts..."
          className="w-full bg-[var(--wb_surface_0)] border border-[var(--wb_border)] rounded-md px-3 py-2 text-[11px] outline-none text-[var(--wb_text)] placeholder:text-[var(--wb_text_dim)] focus:border-[var(--wb_border_highlight)]"
        />
      </div>
      <div className="px-3 pt-3 pb-40 flex flex-col gap-6">
        {activeLauncher && activeLauncher.surface !== "popover" && (
          <div
            onMouseEnter={() => {
              if (activeLauncher.trigger === "hover") {
                clearScheduledClose();
              }
            }}
            onMouseLeave={() => {
              if (activeLauncher.trigger === "hover") {
                scheduleClose(activeLauncher.id);
              }
            }}
          >
            {activeLauncher.renderPanel({
              open: true,
              close: () => closeLauncher(activeLauncher.id),
            })}
          </div>
        )}

        {activeLauncher &&
          activeLauncher.surface === "popover" &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="fixed inset-0 z-[50] pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="absolute pointer-events-auto wb-icon-popover-enter"
                style={{
                  top: `${popoverPosition?.top ?? -10000}px`,
                  left: `${popoverPosition?.left ?? -10000}px`,
                  visibility: popoverPosition ? "visible" : "hidden",
                }}
                onPointerDownCapture={handlePointerDownCapture}
                onMouseEnter={() => {
                  if (activeLauncher.trigger === "hover") {
                    clearScheduledClose();
                  }
                }}
                onMouseLeave={() => {
                  if (activeLauncher.trigger === "hover") {
                    scheduleClose(activeLauncher.id);
                  }
                }}
              >
                {popoverPosition && (
                  <div
                    className="absolute bg-[#ffffff] border-l border-t border-[#d8dee8]"
                    style={{
                      width: `${POPOVER_ARROW_SIZE_PX}px`,
                      height: `${POPOVER_ARROW_SIZE_PX}px`,
                      left: `${-POPOVER_ARROW_SIZE_PX / 2}px`,
                      top: `${popoverPosition.arrowTop}px`,
                      transform: "rotate(-45deg)",
                    }}
                  />
                )}
                <div ref={popoverPanelRef}>
                  {activeLauncher.renderPanel({
                    open: true,
                    close: () => closeLauncher(activeLauncher.id),
                  })}
                </div>
              </div>
            </div>,
            document.body,
          )}

        <div>
          <div className="text-[var(--wb_text)] text-[10px] font-semibold uppercase tracking-[0.1em]">
            Elements
          </div>
          <div className="grid grid-cols-2 mt-3 gap-2">
            {elementItems.map((item) => (
              <div
                key={`item-elements-${item.id}`}
                data-canvas-drag-source="palette"
                data-canvas-template-type={item.id}
                className="flex-1 bg-[var(--wb_surface_2)] text-[var(--wb_text)] cursor-grab rounded-md py-3 flex gap-1.5 flex-col justify-center items-center border border-[var(--wb_border)] hover:border-[var(--wb_border_highlight)] transition-colors"
              >
                {item.icon}
                <div className="text-[11px]">{item.name}</div>
              </div>
            ))}
            {launcherItems.map((launcher) => (
              <button
                key={`item-launcher-${launcher.id}`}
                ref={(element) => registerLauncherElement(launcher.id, element)}
                type="button"
                onClick={() => {
                  if (launcher.trigger === "hover") {
                    openPaletteLauncher(launcher.id);
                    return;
                  }
                  setOpenLauncherId((current) =>
                    current === launcher.id ? null : launcher.id,
                  );
                }}
                onMouseEnter={() => {
                  if (launcher.trigger === "hover") {
                    openPaletteLauncher(launcher.id);
                  }
                }}
                onMouseLeave={() => {
                  if (launcher.trigger === "hover") {
                    scheduleClose(launcher.id);
                  }
                }}
                className="flex-1 bg-[var(--wb_surface_2)] text-[var(--wb_text)] cursor-pointer rounded-md py-3 flex gap-1.5 flex-col justify-center items-center border border-[var(--wb_border)] hover:border-[var(--wb_border_highlight)] transition-colors"
              >
                {launcher.icon}
                <div className="text-[11px]">{launcher.name}</div>
              </button>
            ))}
            {!elementItems.length && !launcherItems.length && (
              <div className="col-span-2 text-[11px] text-[var(--wb_text_dim)] py-2">
                No matching elements
              </div>
            )}
          </div>
        </div>

        {presetGroups.map((group) => (
          <div key={group.group}>
            <div className="text-[var(--wb_text)] text-[10px] font-semibold uppercase tracking-[0.1em]">
              {group.group}
            </div>
            <div className="grid grid-cols-2 mt-3 gap-2">
              {group.items.map((item) => (
                <div
                  key={`item-preset-${item.id}`}
                  data-canvas-drag-source="palette"
                  data-canvas-template-type={item.id}
                  className="flex-1 bg-[var(--wb_surface_2)] text-[var(--wb_text)] cursor-grab rounded-md py-3 flex gap-1.5 flex-col justify-center items-center border border-[var(--wb_border)] hover:border-[var(--wb_border_highlight)] transition-colors"
                >
                  {item.icon}
                  <div className="text-[11px]">{item.name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {!presetGroups.length && (
          <div className="text-[11px] text-[var(--wb_text_dim)] py-2">
            No matching preset groups
          </div>
        )}
      </div>
    </div>
  );
}
