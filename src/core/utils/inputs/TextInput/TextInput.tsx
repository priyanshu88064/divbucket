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
    <div className="relative bg-[#1B2228] rounded-xs text-[var(--text_0)] flex gap-1 w-full">
      <input
        value={val}
        className={`
          peer w-full flex-[1] p-[6px] pr-0 z-0 outline-none
          ${val === "auto" ? "text-gray-500" : ""}
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
        <div className="z-[1] absolute hidden peer-focus:block w-full max-h-[150px] bottom-0 translate-y-full bg-black overflow-y-scroll text-[var(--text_0)]">
          {units.map((unit) => (
            <div
              onMouseDown={() => {
                setVal(unit);
              }}
              key={unit}
              className="p-[5px] hover:bg-[var(--hoverblue)]"
            >
              {unit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
