import { editorRegistry } from "@core/kernel/bootstrap";

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

const registryLayoutItems = editorRegistry
  .listPresets()
  .filter((definition) => definition.group === "Sections")
  .sort((a, b) => a.order - b.order)
  .map((definition) => ({
    id: definition.id,
    icon: definition.icon?.() || (
      <div className="border border-gray-500 rounded-sm px-2 py-0.5 text-xs uppercase">
        {definition.label.slice(0, 2)}
      </div>
    ),
    name: definition.label,
  }));

export default function ElementsTab() {
  return (
    <div className="p-3 pb-48 flex flex-col gap-8 overflow-y-auto">
      <div>
        <div className="mt-2 text-[var(--text_0)] text-xs font-semibold uppercase">
          Elements
        </div>
        <div className="grid grid-cols-2 mt-4 gap-3">
          {registryElementItems.map((item) => (
            <div
              key={`item-elements-${item.id}`}
              draggable
              data-type={item.id}
              className="flex-1 bg-[#333C46] text-[var(--text_0)] cursor-grab rounded-md shadow-lg py-4 flex gap-2 flex-col justify-center items-center border border-gray-600"
            >
              {item.icon}
              <div>{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mt-2 text-[var(--text_0)] text-xs font-semibold uppercase">
          Layouts
        </div>
        <div className="grid grid-cols-2 mt-4 gap-3">
          {registryLayoutItems.map((item) => (
            <div
              key={`item-layout-${item.id}`}
              draggable
              data-type={item.id}
              className="flex-1 bg-[#333C46] text-[var(--text_0)] cursor-grab rounded-md shadow-lg py-4 flex gap-2 flex-col justify-center items-center border border-gray-600"
            >
              {item.icon}
              <div>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
