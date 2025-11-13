import {
  FaHome,
  FaLaptop,
  FaMobileAlt,
  FaPlay,
  FaTabletAlt,
} from "react-icons/fa";
import styles from "./headbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { updateRootWidth } from "../../store/reducers/treeReducer";
import { MdFullscreen, MdOutlineContentCopy } from "react-icons/md";
import { FaDownload } from "react-icons/fa6";
import { useRef, useState } from "react";
import { LuPaintBucket } from "react-icons/lu";
import type { RootState } from "../../store/store";
import { useGenerateCode } from "../../hooks/useGenerateCode";
import { preview } from "../../store/reducers/previewReducer";
import { createPortal } from "react-dom";

export default () => {
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );
  const [isCode, setIsCode] = useState(false);
  const { generate } = useGenerateCode();
  const dispatch = useDispatch();

  return (
    <div className="bg-[#283037] text-white h-[30px] flex items-center justify-between border-b border-gray-600 z-[5]">
      {/* LOGO */}
      <div className="flex items-baseline-last gap-1 flex-[1] text-orange-400">
        <LuPaintBucket className="ml-4 self-center" />
        <div className="text-md font-bold italic">DIV</div>
        <div className="text-white text-[10px]">Bucket</div>
      </div>
      <div className={styles.h1}>
        {activeTab && <WidthBox />}
        <div
          className={styles.fscreen}
          onClick={() => {
            if (!document.fullscreenElement)
              document.documentElement.requestFullscreen();
            else if (document.exitFullscreen) document.exitFullscreen();
          }}
        >
          <MdFullscreen size={18} />
        </div>
      </div>
      <div className="flex flex-[1] justify-end text-[9px] tracking-wider">
        <div
          onClick={() => {
            if (!activeTab) return;
            const pageSrc = generate({
              tab: activeTab,
              isInternalStyleSheet: true,
            }).html;
            dispatch(preview({ pageSrc }));
          }}
          className={`px-5 py-1 mx-2 flex items-center gap-2 rounded-sm cursor-pointer border border-transparent hover:border-blue-400 active:bg-hoverblue`}
        >
          <FaPlay />
          PREVIEW
        </div>
        <div
          onClick={() => setIsCode((f) => !f)}
          className="bg-hoverblue px-5 py-1 mx-2 flex items-center gap-2 rounded-sm cursor-pointer border border-transparent hover:border-blue-400 active:bg-hoverblue"
        >
          <FaDownload />
          HTML/CSS
        </div>
      </div>
      {isCode &&
        activeTab &&
        createPortal(
          <div
            className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/90 z-[4]"
            onClick={() => setIsCode(false)}
          >
            <div
              className="relative flex max-h-[500px] max-w-[800px] w-[90%] h-[90%] rounded-sm bg-[#1B2228] p-4 gap-2 text-xs text-[var(--text_0)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Code />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

const Code = () => {
  const tabs = useSelector((state: RootState) => state.treeReducer.tree[-1]);
  const dataMap = useSelector((state: RootState) => state.treeReducer.dataMap);
  const [activeTab, setActiveTab] = useState(0);
  const { generate } = useGenerateCode();

  const code = tabs.map((tab) =>
    generate({ tab, isInternalStyleSheet: false }),
  );
  const [isHtml, setIsHtml] = useState(true);
  const copiedRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div
        className={`${styles.codesidebar} w-[150px] rounded-sm p-2 overflow-y-scroll bg-[#283037]`}
      >
        {tabs.map((tab, ind) => (
          <div
            key={tab + ind + ""}
            className={`
              flex items-center gap-1 p-1 cursor-pointer
              ${ind === activeTab ? "bg-gray-600" : ""}
            `}
            onClick={() => setActiveTab(ind)}
          >
            <FaHome />
            {dataMap[tab].name}
          </div>
        ))}
      </div>
      <div className={styles.codearea}>
        <div
          className={styles.codecopy}
          onClick={() => {
            if (isHtml) navigator.clipboard.writeText(code[activeTab].html);
            else navigator.clipboard.writeText(code[activeTab].css);
            if (copiedRef && copiedRef.current)
              copiedRef.current.style.visibility = "visible";
            setTimeout(() => {
              if (copiedRef && copiedRef.current)
                copiedRef.current.style.visibility = "hidden";
            }, 1000);
          }}
        >
          <MdOutlineContentCopy size={20} />
          <div style={{ visibility: "hidden" }} ref={copiedRef}>
            copied!!
          </div>
        </div>
        <div className={styles.catabs}>
          <div
            onClick={() => setIsHtml(true)}
            className={`${isHtml && styles.catabsactive}`}
          >
            HTML
          </div>
          <div
            onClick={() => setIsHtml(false)}
            className={`${!isHtml && styles.catabsactive}`}
          >
            CSS
          </div>
        </div>
        <textarea
          style={{ color: isHtml ? "orange" : "" }}
          value={
            isHtml
              ? code[activeTab].html
              : code[activeTab].css.length > 5000
                ? code[activeTab].css.substr(0, 5000) + `\n...`
                : code[activeTab].css
          }
          readOnly
        />
        <div className={styles.codewarning}>
          * generated html/css code may contain bugs and produce unexpected
          results. App is in development phase, bugs will be fixed as soon as
          possible.
        </div>
      </div>
    </>
  );
};

const WidthBox = () => {
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );
  const maxWidth = useSelector((state: RootState) =>
    Math.floor(state.treeReducer.bgContentRect?.width - 8),
  ); // 8 for resizebar
  const width = useSelector((state: RootState) => {
    if (!activeTab) return;
    if (state.treeReducer.styleMap[activeTab].default.width === "100%")
      return maxWidth;
    return Math.min(
      maxWidth,
      Math.max(
        350,
        Number(
          (state.treeReducer.styleMap[activeTab].default.width as string).split(
            "p",
          )[0],
        ),
      ),
    );
  });
  const dispatch = useDispatch();

  if (!width) {
    return <></>;
  }

  return (
    <>
      <div className={styles.dimensions}>
        <div
          onClick={() => dispatch(updateRootWidth({ width: "425px" }))}
          title="mobile"
          className={`${styles.d0} ${width <= 425 && styles.active}`}
        >
          <FaMobileAlt size={12} />
        </div>
        <div
          onClick={() => dispatch(updateRootWidth({ width: "768px" }))}
          title="tablet"
          className={`${styles.d0} ${width > 425 && width <= 768 && styles.active}`}
        >
          <FaTabletAlt size={12} />
        </div>
        <div
          onClick={() => dispatch(updateRootWidth({ width: "100%" }))}
          title="PC"
          className={`${styles.d0} ${width > 768 && styles.active}`}
        >
          <FaLaptop size={13} />
        </div>
      </div>
      <div className={styles.width}>
        <div>
          {width <= 425
            ? "Mobile"
            : width > 425 && width <= 768
              ? "Tablet"
              : "Laptop"}
        </div>
        {width}px
      </div>
    </>
  );
};
