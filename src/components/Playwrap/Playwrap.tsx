import { MdOutlineSecurityUpdateWarning } from "react-icons/md";
import Headbar from "../Headbar/Headbar";
import styles from "./playwrap.module.css";
import { lazy, Suspense, useRef } from "react";
import Playground from "../playground/Playground";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const Preview = lazy(() => import("../preview/Preview"));

export default () => {
  const widthRef = useRef(window.screen.width);
  const isPreviewOpen = useSelector(
    (state: RootState) => state.previewReducer.isOpen,
  );

  return (
    <div className={styles.playwrap}>
      <Headbar />
      <Playground />

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

      {isPreviewOpen && (
        <Suspense
          fallback={
            <div className="fixed top-0 left-0 w-full h-full bg-white" />
          }
        >
          <Preview />
        </Suspense>
      )}
    </div>
  );
};
