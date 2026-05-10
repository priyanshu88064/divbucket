import { useSelector } from "react-redux";
import { DOCUMENT_VERSION, type Document } from "@core/types/document";
import { generateDocumentExport } from "@core/export/generateCode";
import { selectExportDocumentState } from "@core/state/selectors/treeSelectors";

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
