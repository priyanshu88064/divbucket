import { useDispatch, useSelector } from "react-redux";
import ListOfProp from "./ListOfProp";
import { updateCssState } from "@core/state/reducers/treeReducer";
import type { CssState } from "@core/types/document";
import {
  selectActiveNodeId,
  selectCssState,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import styles from "../../cssbar.module.css";

export default function CssTab() {
  useRenderCounter("CssTab");
  const id = useSelector(selectActiveNodeId);
  const cssState = useSelector(selectCssState);
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.cssTabPanel}>
        <div className={styles.stateTitle}>State</div>
        <div className={styles.stateSwitch}>
          {["default", "hover", "active"].map((state, ind) => (
            <button
              key={"state" + ind}
              type="button"
              onClick={() =>
                dispatch(updateCssState({ cssState: state as CssState }))
              }
              className={`${styles.stateButton} ${
                cssState === state ? styles.stateButtonActive : ""
              }`}
            >
              {state}
            </button>
          ))}
        </div>
      </div>
      {id ? <ListOfProp id={id} cssState={cssState} /> : <></>}
    </>
  );
}
