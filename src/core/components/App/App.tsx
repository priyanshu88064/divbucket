import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import styles from "./app.module.css";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import {
  addDocument,
  updateActiveNode,
  updateActivePageId,
} from "@core/state/reducers/treeReducer";
import Headbar from "../Headbar/Headbar";
import PlaygroundContainer from "../Playground/PlaygroundContainer/PlaygroundContainer";
import Preview from "../Preview/Preview";
import {
  loadDocument,
  mergeDocuments,
} from "@core/document/loadDocument";
import { amplifyDocument } from "@core/document/amplifyDocument";
import useCanvasFocusGuards from "@core/hooks/useCanvasFocusGuards";

export default () => {
  const isPreviewOpen = useSelector(
    (state: RootState) => state.previewReducer.isOpen,
  );
  const dispatch = useDispatch();
  useCanvasFocusGuards();

  useEffect(() => {
    const initDefaultProject = async () => {
      const rawProjects = await Promise.all([
        fetch("/projects/witcher.json").then((res) => res.json()),
        fetch("/projects/divbucket.json").then((res) => res.json()),
        fetch("/projects/needhelp.json").then((res) => res.json()),
      ]);
      const canonicalDocs = rawProjects.map((raw) => loadDocument(raw));
      let mergedDocument = mergeDocuments(canonicalDocs);
      const scaleParam = Number(
        new URLSearchParams(window.location.search).get("scale") || "1",
      );
      if (import.meta.env.DEV && Number.isFinite(scaleParam) && scaleParam > 1) {
        mergedDocument = amplifyDocument({
          document: mergedDocument,
          copies: Math.floor(scaleParam),
        });
      }
      const pageOpenMap = mergedDocument.pageIds.reduce(
        (acc, id) => ({ ...acc, [id]: true }),
        {} as Record<number, boolean>,
      );
      const firstPageId = mergedDocument.pageIds[0];

      dispatch(
        addDocument({
          ...mergedDocument,
          pageOpenMap,
          activeNodeId: firstPageId ?? null,
          hoverNodeId: null,
          activePageId: firstPageId ?? null,
          bgContentRect: {
            width: 0,
            height: 0,
            top: 0,
            left: 0,
          },
          clipboard: {
            cut: null,
            copy: null,
          },
          cssState: "default",
        }),
      );

      if (firstPageId !== undefined) {
        dispatch(updateActivePageId({ pageId: firstPageId }));
        dispatch(updateActiveNode({ id: firstPageId }));
      }
    };
    initDefaultProject();
  }, []);

  return (
    <div className={styles.playwrap}>
      <Headbar />
      <PlaygroundContainer />
      <RestrictSmallerScreen />

      {isPreviewOpen && <Preview />}
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
