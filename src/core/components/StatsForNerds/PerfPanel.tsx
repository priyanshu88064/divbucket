import { resetRenderPerf, useRenderPerfSnapshot } from "@core/editor/ui/renderPerf";

export default function PerfPanel() {
  const counts = useRenderPerfSnapshot();
  const entries = Object.entries(counts).slice(0, 12);

  return (
    <div className="mt-4 border border-gray-700 rounded-sm p-2 col-span-2">
      <div className="flex items-center justify-between text-gray-100 mb-2">
        <div className="text-[11px]">Render perf (dev only)</div>
        <button
          className="px-2 py-[2px] text-[10px] border border-gray-500 rounded-sm hover:border-blue-400"
          onClick={resetRenderPerf}
          type="button"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-1 text-[10px]">
        {entries.length === 0 ? (
          <div className="text-gray-400">No samples yet</div>
        ) : (
          entries.map(([name, count]) => (
            <div key={name} className="contents">
              <div className="text-gray-300 truncate">
                {name}
              </div>
              <div className="text-orange-300 text-right">
                {count}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
