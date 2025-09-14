import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import Headbar from "../Headbar/Headbar";
import styles from "./playwrap.module.css";
import { lazy, Suspense, useEffect, useRef } from "react";
import Playground from "../playground/Playground";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { Template } from "../../types/Template";
import {
  addTemplate,
  updateActiveNode,
  updateActiveTab,
} from "../../store/reducers/treeReducer";

const Preview = lazy(() => import("../preview/Preview"));

export default () => {
  const isPreviewOpen = useSelector(
    (state: RootState) => state.previewReducer.isOpen,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const initDefaultProject = async () => {
      const response = await fetch("/projects/divbucket.json");
      const data = (await response.json()) as Template;

      dispatch(
        addTemplate({
          tree: data.tree,
          styleMap: data.styleMap,
          dataMap: data.dataMap,
        }),
      );

      if (data.tree[-1] && data.tree[-1].length) {
        dispatch(updateActiveTab({ tab: data.tree[-1][0] }));
        dispatch(updateActiveNode({ id: data.tree[-1][0] }));
      }
    };
    initDefaultProject();
  }, []);

  return (
    <div className={styles.playwrap}>
      <Headbar />
      <Playground />
      <RestrictSmallerScreen />

      {isPreviewOpen && (
        <Suspense fallback={<></>}>
          <Preview />
        </Suspense>
      )}
    </div>
  );
};

const RestrictSmallerScreen = () => {
  const widthRef = useRef(window.screen.width);
  return (
    <>
      {widthRef.current < 1024 && (
        <div className={styles.notsupported}>
          <div className={styles.ns0}>
            <div className={styles.ns00}>Unsupported Device</div>
            <div className={styles.ns01}>
              <MdOutlineSecurityUpdateWarning size={100} />
              <div className={styles.ns010}>
                Your device's screen is too small to support this app.
              </div>
              <div>Please use a Laptop, PC or device with a wider screen.</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
