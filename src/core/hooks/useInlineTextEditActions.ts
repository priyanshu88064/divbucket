import { useMemo } from "react";
import { useDispatch, useStore } from "react-redux";
import { updateDataMap } from "@core/state/reducers/treeReducer";
import type { AppDispatch, RootState } from "@core/state/store";
import { isContentNodeRecord } from "@core/types/document";
import {
  cancelInlineTextEdit,
  commitInlineTextEdit,
  getInlineTextEditStateSnapshot,
  startInlineTextEdit,
} from "./inlineTextEditSession";

export function useInlineTextEditActions() {
  const dispatch = useDispatch<AppDispatch>();
  const store = useStore<RootState>();

  return useMemo(
    () => ({
      startEditing: ({
        nodeId,
        surfaceId,
        initialContent,
      }: {
        nodeId: number;
        surfaceId: string;
        initialContent: string;
      }) => {
        const current = getInlineTextEditStateSnapshot();
        if (current.editingNodeId === nodeId) return current;
        if (current.editingNodeId !== null) {
          const committed = commitInlineTextEdit();
          if (committed && committed.editingNodeId !== null) {
            const state = store.getState();
            const record = state.treeReducer.nodeRecordMap[committed.editingNodeId];
            if (record && isContentNodeRecord(record)) {
              dispatch(
                updateDataMap({
                  id: committed.editingNodeId,
                  data: {
                    ...record,
                    content: committed.draftContent,
                  },
                }),
              );
            }
          }
        }
        return startInlineTextEdit(nodeId, surfaceId, initialContent);
      },
      commitEditing: () => {
        const committed = commitInlineTextEdit();
        if (!committed || committed.editingNodeId === null) return committed;
        const state = store.getState();
        const record = state.treeReducer.nodeRecordMap[committed.editingNodeId];
        if (!record || !isContentNodeRecord(record)) {
          return committed;
        }
        if (record.content === committed.draftContent) {
          return committed;
        }
        dispatch(
          updateDataMap({
            id: committed.editingNodeId,
            data: {
              ...record,
              content: committed.draftContent,
            },
          }),
        );
        return committed;
      },
      cancelEditing: () => cancelInlineTextEdit(),
    }),
    [dispatch, store],
  );
}
