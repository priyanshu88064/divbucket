import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import { closePreview } from "@core/state/reducers/previewReducer";
import { IoExitOutline } from "react-icons/io5";
import { LuPaintBucket } from "react-icons/lu";

export default function Preview(): React.JSX.Element {
  const isOpen = useSelector((state: RootState) => state.previewReducer.isOpen);
  const pageSrc = useSelector(
    (state: RootState) => state.previewReducer.pageSrc,
  );
  const dispatch = useDispatch();

  if (!isOpen) return <></>;

  return createPortal(
    <div className="fixed z-[9999] top-0 left-0 h-full w-full bg-white flex flex-col">
      <div className="flex items-center justify-between bg-[#283037] h-8 text-gray-200 text-xs">
        <div className="flex items-baseline-last gap-1 text-orange-400">
          <LuPaintBucket size={20} className="ml-[30px] self-center" />
          <div className="text-[20px] font-bold italic">DIV</div>
          <div className="text-white text-xs">Bucket</div>
        </div>
        <div
          onClick={() => dispatch(closePreview())}
          className="uppercase h-full flex gap-2 items-center justify-center px-4 cursor-pointer border border-transparent hover:border-blue-400 active:bg-hoverblue"
        >
          Exit Preview
          <IoExitOutline size={16} />
        </div>
      </div>
      <div className="h-full">
        <iframe srcDoc={pageSrc} className="w-full h-full" />
      </div>
    </div>,
    document.body,
  );
}
