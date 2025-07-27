import styles from "./textinput.module.css";
import { useEffect, useState } from "react";

export default ({
  onChange,
  value,
  units,
}: {
  value: string;
  units: string[];
  onChange: (value: string) => void;
}) => {
  const [val, setVal] = useState(value || "auto");

  useEffect(() => {
    setVal(value || "auto");
  }, [value]);

  return (
    <div className={styles.ti}>
      <input
        value={val}
        className={val === "auto" ? styles.auto : ""}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => onChange(val)}
        onFocus={(e) => e.target.select()}
        onKeyUp={(e) => {
          if (e.key === "Enter") onChange(val);
        }}
      />
      {units && units.length && (
        <div className={styles.dropdown}>
          {units.map((unit) => (
            <div
              onMouseDown={() => {
                setVal(unit);
              }}
              key={unit}
            >
              {unit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
