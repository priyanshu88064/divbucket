import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import ListOfProp from "./ListOfProp";
import { updateCssState } from "../../../../store/reducers/treeReducer";
import type { CssState } from "../../../../types/Tree";

export default function CssTab() {
  const id = useSelector((state: RootState) => state.treeReducer.activeNodeId);
  const cssState = useSelector(
    (state: RootState) => state.treeReducer.cssState,
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="p-2 py-4 mb-4">
        <div>State</div>
        <div className="flex bg-[#333C46] mt-4 rounded-full overflow-hidden border border-gray-600 shadow-md cursor-pointer text-center">
          {["default", "hover", "active"].map((state, ind) => (
            <div
              key={"state" + ind}
              onClick={() =>
                dispatch(updateCssState({ cssState: state as CssState }))
              }
              className={`
                  flex-1 p-2 py-1 border border-transparent hover:border-blue-400 active:bg-hoverblue rounded-full
                  ${cssState === state ? "bg-hoverblue text-white" : "text-gray-300"}
                `}
            >
              {state}
            </div>
          ))}
        </div>
      </div>
      {id ? <ListOfProp id={id} cssState={cssState} /> : <></>}
    </>
  );
}
