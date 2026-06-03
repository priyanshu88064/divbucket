import { useState } from "react";
import type { RootState } from "@core/state/store";
import { useSelector } from "react-redux";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import styles from "./cssbar.module.css";

// mapping of unsupported props to a node type
const propBlackList: { [key: string]: string[] } = {
  root: ["Size", "Margin", "Shadows", "Transform", "Position"],
  Image: ["Display", "Typography"],
  Video: ["Display", "Typography"],
};

// initially collapsed props
const activeBlacklist = [
  "Border",
  "Position",
  "Overflow",
  "Shadows",
  "Transform",
  "Cursor",
  "Transition",
  "Fitting & Alignment",
];

export default function Wrap({
  children,
  title,
  heading,
}: {
  children?: React.ReactNode;
  title: string;
  heading?: boolean;
}) {
  const [isActive, setIsActive] = useState(!activeBlacklist.includes(title));
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);

  if (!id) throw new Error();
  const type = useSelector(
    (state: RootState) => state.treeReducer.nodeRecordMap[id].type,
  );

  return (
    <>
      {!propBlackList[type]?.includes(title) && (
        <section className={styles.sectionWrap}>
          <button
            type="button"
            className={`${styles.sectionHeader} ${isActive ? styles.sectionHeaderOpen : ""}`}
            onClick={() => setIsActive((f) => !f)}
          >
            <div className={styles.sectionTitle}>{title}</div>
            <div className={styles.sectionChevron}>
              {!heading ? (
                isActive ? (
                  <MdKeyboardArrowDown className="text-[14px]" />
                ) : (
                  <MdKeyboardArrowRight className="text-[14px]" />
                )
              ) : (
                ""
              )}
            </div>
          </button>
          {isActive && <div className={styles.sectionBody}>{children}</div>}
        </section>
      )}
    </>
  );
}
