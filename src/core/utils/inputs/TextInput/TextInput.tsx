import { useEffect, useState } from "react";

export default ({
  onChange,
  value,
  units,
  isSelectOnly = false,
}: {
  value: string;
  units?: string[];
  onChange: (value: string) => void;
  isSelectOnly?: boolean;
}) => {
  const [val, setVal] = useState(value || "auto");

  useEffect(() => {
    setVal(value || "auto");
  }, [value]);

  return (
    <div className="relative w-full rounded-md border border-[var(--wb_border)] bg-[var(--wb_surface_0)] text-[var(--wb_text)] transition-colors focus-within:border-[var(--wb_border_highlight)]">
      <input
        value={val}
        className={`
          peer z-0 w-full bg-transparent px-2 py-[5px] text-[12px] leading-4 outline-none
          ${val === "auto" ? "text-[var(--wb_text_dim)]" : "text-[var(--wb_text)]"}
        `}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => onChange(val)}
        onFocus={(e) => e.target.select()}
        onKeyUp={(e) => {
          if (e.key === "Enter") onChange(val);
        }}
        readOnly={isSelectOnly}
      />
      {units && units.length && (
        <div className="absolute bottom-0 z-[3] hidden max-h-[170px] w-full translate-y-full overflow-y-auto rounded-md border border-[var(--wb_border)] bg-[var(--wb_surface_0)] py-1 text-[12px] text-[var(--wb_text)] shadow-lg shadow-black/40 peer-focus:block">
          {units.map((unit) => (
            <div
              onMouseDown={() => {
                setVal(unit);
              }}
              key={unit}
              className="cursor-pointer px-2 py-[5px] hover:bg-[var(--wb_surface_2)]"
            >
              {unit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
