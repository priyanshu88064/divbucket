import { useEffect } from "react";
import { useSelector } from "react-redux";
import { DOCUMENT_VERSION, type Document } from "@core/types/document";
import { generateDocumentExport } from "@core/export/generateCode";
import { selectExportDocumentState } from "@core/state/selectors/treeSelectors";
import { loadIconPack, parseIconId } from "@plugins/core/nodes/icon/catalog";

export const createExportDocument = ({
  pageIds,
  nodeChildrenMap,
  nodeRecordMap,
  nodeStyleMap,
}: Pick<
  ReturnType<typeof selectExportDocumentState>,
  "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
>): Document => ({
  version: DOCUMENT_VERSION,
  pageIds,
  nodeChildrenMap,
  nodeRecordMap,
  nodeStyleMap,
});

export function useGenerateCode() {
  const documentState = useSelector(selectExportDocumentState);

  useEffect(() => {
    const packIds = new Set<ReturnType<typeof parseIconId>["packId"]>();

    for (const record of Object.values(documentState.nodeRecordMap)) {
      if (record.type !== "custom:icon") continue;
      const rawIconId =
        record.payload && typeof record.payload.iconId === "string"
          ? record.payload.iconId
          : undefined;
      packIds.add(parseIconId(rawIconId).packId);
    }

    packIds.forEach((packId) => {
      void loadIconPack(packId);
    });
  }, [documentState.nodeRecordMap]);

  const generate = ({
    tab,
    isInternalStyleSheet,
  }: {
    tab: number;
    isInternalStyleSheet: boolean;
  }) =>
    generateDocumentExport({
      document: createExportDocument({
        pageIds: documentState.pageIds,
        nodeChildrenMap: documentState.nodeChildrenMap,
        nodeRecordMap: documentState.nodeRecordMap,
        nodeStyleMap: documentState.nodeStyleMap,
      }),
      pageId: tab,
      stylesheetMode: isInternalStyleSheet ? "internal" : "external",
    });

  return { generate };
}
