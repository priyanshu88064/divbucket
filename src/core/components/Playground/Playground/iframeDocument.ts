import { assemblePageDocument } from "@core/export/pageDocumentShell";
export const IFRAME_CANVAS_MOUNT_ID = "db-iframe-canvas-root";

export const createIframeCanvasDocumentHtml = ({
  baseCss,
  mountId = IFRAME_CANVAS_MOUNT_ID,
}: {
  baseCss: string;
  mountId?: string;
}) =>
  assemblePageDocument({
    title: "DivBucket Canvas",
    bodyHtml: `<body>
  <div id="${mountId}"></div>
</body>
`,
    stylesheetHref: null,
    inlineCss: `${baseCss}
html,
body {
  margin: 0;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}
`,
  });

export const bootstrapIframeCanvasDocument = ({
  contentDocument,
  baseCss,
  mountId = IFRAME_CANVAS_MOUNT_ID,
}: {
  contentDocument: Document;
  baseCss: string;
  mountId?: string;
}) => {
  contentDocument.open();
  contentDocument.write(
    createIframeCanvasDocumentHtml({
      baseCss,
      mountId,
    }),
  );
  contentDocument.close();

  const mountElement = contentDocument.getElementById(mountId);
  if (!mountElement) {
    throw new Error(`Iframe canvas mount element is missing: #${mountId}`);
  }

  return mountElement;
};
