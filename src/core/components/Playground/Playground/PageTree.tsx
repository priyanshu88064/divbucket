import { memo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@core/state/store";
import { selectNodeChildrenById } from "@core/state/selectors/treeSelectors";
import EditorNodeShell from "../../Renderer/EditorNodeShell";
import type { EditorInteractionMode } from "@core/types/canvas";
import { useRenderCounter } from "@core/hooks/useRenderCounter";

export function PageTree({
  rootId,
  interactionMode,
  surfaceId,
}: {
  rootId: number;
  interactionMode: EditorInteractionMode;
  surfaceId: string;
}) {
  useRenderCounter("PageTree");
  return (
    <EditorNodeShell
      id={rootId}
      interactionMode={interactionMode}
      surfaceId={surfaceId}
    >
      <NodeBranch
        parentId={rootId}
        interactionMode={interactionMode}
        surfaceId={surfaceId}
      />
    </EditorNodeShell>
  );
}

const NodeBranch = memo(function NodeBranch({
  parentId,
  interactionMode,
  surfaceId,
}: {
  parentId: number;
  interactionMode: EditorInteractionMode;
  surfaceId: string;
}) {
  useRenderCounter("PageTreeNodeBranch");
  const children = useSelector((state: RootState) =>
    selectNodeChildrenById(state, parentId),
  );

  return (
    <>
      {children.map((nodeId) => (
        <EditorNodeShell
          key={nodeId}
          id={nodeId}
          interactionMode={interactionMode}
          surfaceId={surfaceId}
        >
          <NodeBranch
            parentId={nodeId}
            interactionMode={interactionMode}
            surfaceId={surfaceId}
          />
        </EditorNodeShell>
      ))}
    </>
  );
});
