import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function Preview(): React.JSX.Element {
  const isOpen = useSelector((state: RootState) => state.previewReducer.isOpen);
  const pageSrc = useSelector(
    (state: RootState) => state.previewReducer.pageSrc,
  );

  if (!isOpen) return <></>;

  return createPortal(
    <div className="fixed top-0 left-0 h-full w-full bg-white flex flex-col">
      <div className="bg-gray-500">i am navbar</div>
      <div className="h-full">
        <iframe srcDoc={pageSrc} className="w-full h-full" />
      </div>
    </div>,
    document.body,
  );
}
