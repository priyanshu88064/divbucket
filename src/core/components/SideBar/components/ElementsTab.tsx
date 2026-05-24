import { editorRegistry } from "@core/kernel/bootstrap";
import { type ReactNode, useDeferredValue, useState } from "react";
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

export default function ElementsTab() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const elementItems = registryElementItems.filter(
    (item) =>
      deferredQuery.length === 0 ||
      item.name.toLowerCase().includes(deferredQuery),
  );
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
    <div className="p-3 pb-40 flex flex-col gap-6 overflow-y-auto h-full">
      <div className="sticky top-0 z-[2] bg-[var(--wb_surface_1)] pb-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search elements and layouts..."
          className="w-full bg-[var(--wb_surface_0)] border border-[var(--wb_border)] rounded-md px-3 py-2 text-[11px] outline-none text-[var(--wb_text)] placeholder:text-[var(--wb_text_dim)] focus:border-[var(--wb_border_highlight)]"
        />
      </div>
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
          {!elementItems.length && (
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
  );
}
