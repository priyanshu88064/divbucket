import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useDrag } from "../../../hooks/useDrag";
import SideBar from "../../SideBar/SideBar";
import Playground from "../Playground/Playground";
import Cssbar from "../../Cssbar/Cssbar";

export default function PlaygroundContainer() {
  const activeTab = useSelector(
    (state: RootState) => state.treeReducer.activeTab,
  );
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
      {activeTab && <Playground />}
      <Cssbar />
    </div>
  );
}
