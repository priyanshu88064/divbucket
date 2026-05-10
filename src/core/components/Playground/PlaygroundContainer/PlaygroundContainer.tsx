import { useSelector } from "react-redux";
import { useDrag } from "@core/hooks/useDrag";
import SideBar from "../../SideBar/SideBar";
import Playground from "../Playground/Playground";
import Cssbar from "../../Cssbar/Cssbar";
import { selectActivePageId } from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export default function PlaygroundContainer() {
  useRenderCounter("PlaygroundContainer");
  const activePageId = useSelector(selectActivePageId);
  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  } = useDrag();

  return (
    <div
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      className="flex h-full w-full overflow-hidden bg-[var(--pg_bg)]"
    >
      <SideBar />
      {activePageId && <Playground />}
      <Cssbar />
    </div>
  );
}
