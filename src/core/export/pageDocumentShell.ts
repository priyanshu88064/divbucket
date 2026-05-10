const escapeText = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const escapeStyleText = (css: string) => css.replaceAll("</style>", "<\\/style>");

export interface PageDocumentShellOptions {
  title: string;
  bodyHtml: string;
  stylesheetHref?: string | null;
  inlineCss?: string | null;
}

export const assemblePageDocument = ({
  title,
  bodyHtml,
  stylesheetHref = "style.css",
  inlineCss,
}: PageDocumentShellOptions) => {
  const safeTitle = escapeText(title);
  const stylesheetLink = stylesheetHref
    ? `<link rel="stylesheet" href="${stylesheetHref}">`
    : "";
  const styleTag =
    inlineCss && inlineCss.trim()
      ? `<style>
${escapeStyleText(inlineCss)}
</style>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${stylesheetLink}
        <title>${safeTitle}</title>
        ${styleTag}
</head>
${bodyHtml}</html>`;
};

