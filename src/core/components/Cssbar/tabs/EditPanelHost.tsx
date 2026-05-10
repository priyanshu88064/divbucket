import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editorRegistry } from "@core/kernel/bootstrap";
import type { RootState } from "@core/state/store";
import { updateDataMap } from "@core/state/reducers/treeReducer";
import type { NodeRecord } from "@core/types/document";

export default function EditPanelHost({ id, focus }: { id: number; focus: string }) {
  const dispatch = useDispatch();
  const nodeRecord = useSelector((state: RootState) => state.treeReducer.nodeRecordMap[id]);
  const [draftRecord, setDraftRecord] = useState<NodeRecord>(nodeRecord);

  useEffect(() => {
    setDraftRecord(nodeRecord);
  }, [nodeRecord]);

  const nodeDefinition = editorRegistry.getNodeType(nodeRecord.type);
  if (!nodeDefinition) {
    throw new Error(`Missing node definition for kind: ${nodeRecord.type}`);
  }

  const panelId = nodeDefinition.edit?.panelId;
  if (!panelId) {
    return null;
  }

  const panelDefinition = editorRegistry.getEditPanel(panelId);
  if (!panelDefinition) {
    throw new Error(
      `Missing edit panel "${panelId}" for node kind "${nodeDefinition.kind}"`,
    );
  }

  const commitDraftRecord = (nextRecord?: NodeRecord) => {
    dispatch(updateDataMap({ id, data: nextRecord || draftRecord }));
  };

  const PanelComponent = panelDefinition.component;

  return (
    <PanelComponent
      id={id}
      focus={focus}
      nodeDefinition={nodeDefinition}
      draftRecord={draftRecord}
      setDraftRecord={setDraftRecord}
      commitDraftRecord={commitDraftRecord}
    />
  );
}
