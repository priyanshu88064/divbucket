import { useDispatch, useSelector } from "react-redux";
import type { CSSProperties } from "react";
import type { RootState } from "@core/state/store";
import {
  updateDataMap,
  updateStyleMap,
} from "@core/state/reducers/treeReducer";
import type { CssState, NodeStyleUi } from "@core/types/document";
import StyleInspector from "./styleInspector/StyleInspector";
import type {
  StyleInspectorContext,
  StyleTarget,
} from "./styleInspector/types";
import {
  selectNodeRecordById,
  selectNodeStyleByIdAndState,
} from "@core/state/selectors/treeSelectors";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export default function ListOfProp({
  id,
  cssState,
}: {
  id: number;
  cssState: CssState;
}) {
  useRenderCounter("ListOfProp");
  const dispatch = useDispatch();
  const style = useSelector((state: RootState) =>
    selectNodeStyleByIdAndState(state, id, cssState),
  );
  const node = useSelector((state: RootState) =>
    selectNodeRecordById(state, id),
  );

  const target: StyleTarget = { cssState };

  const setStyle = (nextStyle: CSSProperties) => {
    dispatch(updateStyleMap({ id, style: nextStyle, cssState }));
  };

  const patchStyle = (
    patch: Partial<
      Record<keyof CSSProperties | string, string | number | undefined>
    >,
  ) => {
    const nextStyle = {
      ...style,
      ...patch,
    } as CSSProperties;
    for (const [prop, value] of Object.entries(patch)) {
      if (value === "auto" || value == null) {
        delete (nextStyle as Record<string, unknown>)[prop];
      }
    }
    setStyle(nextStyle);
  };

  const setStyleUi = (nextStyleUi: NodeStyleUi | undefined) => {
    dispatch(
      updateDataMap({
        id,
        data: {
          ...node,
          styleUi: nextStyleUi,
        },
      }),
    );
  };

  const ctx: StyleInspectorContext = {
    id,
    node,
    style,
    styleUi: node.styleUi,
    target,
    setStyle,
    patchStyle,
    setStyleUi,
  };

  return <StyleInspector ctx={ctx} />;
}
