import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import styles from "../cssbar.module.css";
import type { CssState } from "../../../types/Tree";

interface FlexPropertyData {
  name: string;
  prop: string;
  values: string[];
}

export default function FlexProperties({
  id,
  data,
  onChange,
  cssState,
}: {
  id: number;
  data: FlexPropertyData;
  onChange: (value: string) => void;
  cssState: CssState;
}) {
  const styleMap = useSelector(
    (state: RootState) => state.treeReducer.styleMap[id][cssState],
  );
  const [demoStyle, setDemoStyle] = useState({});

  useEffect(() => {
    setDemoStyle({
      flexDirection: styleMap.flexDirection,
      justifyContent: styleMap.justifyContent,
      alignItems: styleMap.alignItems,
    });
  }, [id, styleMap]);

  return (
    <InputDropDown
      name={data.name}
      value={(styleMap as any)[data.prop] || "auto"}
    >
      <div className={styles.dic111}>
        {data.values.map((i, d) => (
          <div
            onMouseEnter={() =>
              setDemoStyle((prev) => ({ ...prev, [data.prop]: i }))
            }
            onMouseDown={() => onChange(i)}
            key={d}
          >
            {i}
          </div>
        ))}
      </div>
      <div className={styles.dic110}>
        <div style={demoStyle} className={styles.dicdemoflex}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
        </div>
      </div>
    </InputDropDown>
  );
}

const InputDropDown = ({
  children,
  name,
  value,
}: {
  children: React.ReactNode;
  name: string;
  value: string;
}) => {
  return (
    <div className={`${styles.dic1} ${styles.beffect}`}>
      <div>{name}</div>
      <div className={`${styles.dic10} ${styles.beffectactivediv}`}>
        {value}
        <IoIosArrowDown />
        <input className={styles.iforhover} readOnly />
      </div>
      <div className={`${styles.dic11} ${styles.makedrop}`}>{children}</div>
    </div>
  );
};
