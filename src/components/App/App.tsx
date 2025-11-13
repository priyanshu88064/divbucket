import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import styles from "./app.module.css";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { Template } from "../../types/Template";
import {
  addTemplate,
  updateActiveNode,
  updateActiveTab,
} from "../../store/reducers/treeReducer";
import type { Tree } from "../../types/Tree";
import Loader from "../Overlays/Loader/Loader";

const Headbar = lazy(() => import("../Headbar/Headbar"));
const PlaygroundContainer = lazy(
  () => import("../Playground/PlaygroundContainer/PlaygroundContainer"),
);
const Preview = lazy(() => import("../Preview/Preview"));

export default () => {
  const isPreviewOpen = useSelector(
    (state: RootState) => state.previewReducer.isOpen,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const initDefaultProject = async () => {
      const [witcher, divbucket, needHelp]: Template[] = await Promise.all([
        fetch("/projects/witcher.json").then((res) => res.json()),
        fetch("/projects/divbucket.json").then((res) => res.json()),
        fetch("/projects/needhelp.json").then((res) => res.json()),
      ]);

      let tree: Tree = { ...witcher.tree, ...divbucket.tree, ...needHelp.tree };
      tree[-1] = [
        witcher.tree[-1][0],
        divbucket.tree[-1][0],
        needHelp.tree[-1][0],
      ];

      dispatch(
        addTemplate({
          tree,
          styleMap: {
            ...witcher.styleMap,
            ...divbucket.styleMap,
            ...needHelp.styleMap,
          },
          dataMap: {
            ...witcher.dataMap,
            ...divbucket.dataMap,
            ...needHelp.dataMap,
          },
        }),
      );

      dispatch(updateActiveTab({ tab: tree[-1][0] }));
      dispatch(updateActiveNode({ id: tree[-1][0] }));
    };
    initDefaultProject();
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <div className={styles.playwrap}>
        <Headbar />
        <PlaygroundContainer />
        <RestrictSmallerScreen />

        {isPreviewOpen && <Preview />}
      </div>
    </Suspense>
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
