import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from "react";
import { FiLoader, FiSearch } from "react-icons/fi";
import IconGlyph from "./IconGlyph";
import {
  ICON_PACKS,
  getCachedIconPack,
  loadIconPack,
  type IconCatalogItem,
} from "./catalog";

interface IconPickerProps {
  open: boolean;
  onClose: () => void;
}

const GRID_COLUMNS = 3;
const GRID_GAP = 8;
const ROW_HEIGHT = 74;
const VIEWPORT_HEIGHT = 340;
const OVERSCAN_ROWS = 4;
const SKELETON_ITEMS = 12;

export default function IconPicker({ open, onClose: _onClose }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [isLoadingPacks, setIsLoadingPacks] = useState(false);
  const [packLoadError, setPackLoadError] = useState<string | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [packLoadVersion, setPackLoadVersion] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setPackLoadError(null);

    const load = async () => {
      setIsLoadingPacks(true);
      try {
        await Promise.all(ICON_PACKS.map((pack) => loadIconPack(pack.id)));
        if (!cancelled) {
          setPackLoadVersion((value) => value + 1);
        }
      } catch {
        if (!cancelled) {
          setPackLoadError("Could not load icon packs.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingPacks(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setScrollTop(0);
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [deferredQuery, open]);

  const filteredItems = useMemo(() => {
    void packLoadVersion;

    const source = ICON_PACKS.flatMap(
      (pack) => getCachedIconPack(pack.id)?.items || [],
    );
    if (!deferredQuery.length) {
      return source;
    }

    return source.filter((item) => {
      if (item.id.includes(deferredQuery)) return true;
      if (item.name.toLowerCase().includes(deferredQuery)) return true;
      return item.keywords.some((keyword) => keyword.includes(deferredQuery));
    });
  }, [deferredQuery, packLoadVersion]);

  const totalRows = Math.ceil(filteredItems.length / GRID_COLUMNS);
  const startRow = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS);
  const visibleRowCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN_ROWS * 2;
  const endRow = Math.min(totalRows, startRow + visibleRowCount);

  const visibleRows = useMemo(() => {
    const rows: {
      row: number;
      items: IconCatalogItem[];
    }[] = [];

    for (let row = startRow; row < endRow; row += 1) {
      const startIndex = row * GRID_COLUMNS;
      const items = filteredItems.slice(startIndex, startIndex + GRID_COLUMNS);
      if (!items.length) continue;
      rows.push({ row, items });
    }

    return rows;
  }, [filteredItems, startRow, endRow]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  const showLoadingSkeleton = isLoadingPacks && filteredItems.length === 0;

  if (!open) return null;

  return (
    <div className="w-[290px] bg-[#ffffff] border border-[#d8dee8] rounded-md text-[#0f172a] shadow-[0_18px_46px_rgba(15,23,42,0.24)] overflow-hidden">
      <div className="h-10 border-b border-[#e2e8f0] flex items-center gap-2 px-3">
        <FiSearch size={14} className="text-[#94a3b8]" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search icons..."
          className="w-full bg-transparent text-[12px] outline-none text-[#0f172a] placeholder:text-[#94a3b8]"
        />
      </div>

      {packLoadError && (
        <div className="px-3 py-2 text-[11px] text-[#dc2626] border-b border-[#fee2e2] bg-[#fef2f2]">
          {packLoadError}
        </div>
      )}

      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className="overflow-y-auto p-2"
        style={{ height: `${VIEWPORT_HEIGHT}px` }}
      >
        <div
          className="relative"
          style={{ height: `${totalRows * ROW_HEIGHT}px` }}
        >
          {showLoadingSkeleton && (
            <div className="absolute inset-0 p-1">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: SKELETON_ITEMS }).map((_, index) => (
                  <div
                    key={`icon-skeleton-${index}`}
                    className="rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-2 h-[66px] animate-pulse"
                  >
                    <div className="h-4 w-4 rounded-sm bg-[#dbe4ee] mx-auto mt-1" />
                    <div className="h-2.5 w-10 rounded-sm bg-[#dbe4ee] mx-auto mt-3" />
                  </div>
                ))}
              </div>
              <div className="absolute right-2 bottom-2 text-[#64748b] text-[10px] flex items-center gap-1.5">
                <FiLoader className="animate-spin" size={10} />
                Loading icons
              </div>
            </div>
          )}

          {!isLoadingPacks && !filteredItems.length && (
            <div className="absolute inset-0 flex items-center justify-center text-[#64748b] text-[11px]">
              No matching icons
            </div>
          )}

          {visibleRows.map(({ row, items }) => (
            <div
              key={`row-${row}`}
              className="absolute w-full grid grid-cols-3 gap-2"
              style={{
                top: `${row * ROW_HEIGHT}px`,
              }}
            >
              {items.map((item) => (
                <div
                  key={`item-icon-${item.id}`}
                  data-canvas-drag-source="palette"
                  data-canvas-template-type="custom:icon"
                  data-canvas-icon-id={item.id}
                  data-canvas-icon-label={item.name}
                  className="bg-[#ffffff] text-[#1e293b] cursor-grab rounded-md px-1.5 py-2 flex gap-1.5 flex-col justify-center items-center border border-[#d8dee8] hover:border-[#60a5fa] hover:bg-[#f8fafc] transition-colors"
                  style={{
                    height: `${ROW_HEIGHT - GRID_GAP}px`,
                  }}
                >
                  <IconGlyph iconId={item.id} size={18} />
                  <div className="text-[10px] leading-tight text-center w-full truncate text-[#334155]">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
