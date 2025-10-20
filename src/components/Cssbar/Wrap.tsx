import { useState } from "react";
import type { RootState } from "../../store/store";
import { useSelector } from "react-redux";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

// mapping of unsupported props to a node type
const propBlackList: { [key: string]: string[] } = {
  root: ["Size", "Margin", "Shadows", "Transform", "Position"],
  Image: ["Display", "Typography"],
};

// initially collapsed props
const activeBlacklist = [
  "Border",
  "Position",
  "Overflow",
  "Shadows",
  "Transform",
  "Cursor",
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
    (state: RootState) => state.treeReducer.dataMap[id].type,
  );

  return (
    <>
      {!propBlackList[type]?.includes(title) && (
        <div className="text-[var(--text_0)] cursor-default border-b border-[var(--gray_border)]">
          <div
            className="flex items-center justify-between select-none"
            onClick={() => setIsActive((f) => !f)}
          >
            <div className="p-[10px] py-4 cursor-pointer">{title}</div>
            <div className="p-[10px]">
              {!heading ? (
                isActive ? (
                  <MdKeyboardArrowDown className="cursor-pointer text-[13px]" />
                ) : (
                  <MdKeyboardArrowRight className="cursor-pointer text-[13px]" />
                )
              ) : (
                ""
              )}
            </div>
          </div>
          {isActive && children}
        </div>
      )}
    </>
  );
}
