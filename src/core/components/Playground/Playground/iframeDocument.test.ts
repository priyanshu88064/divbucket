import { describe, expect, it } from "vitest";
import { PAGE_BASE_CSS } from "@core/export/pageBaseCss";
import {
  IFRAME_CANVAS_MOUNT_ID,
  createIframeCanvasDocumentHtml,
} from "./iframeDocument";

describe("iframe canvas document bootstrap", () => {
  it("creates a minimal document shell with base css and mount node", () => {
    const html = createIframeCanvasDocumentHtml({
      baseCss: PAGE_BASE_CSS,
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    expect(html).toContain(PAGE_BASE_CSS.trim());
    expect(html).toContain(`id="${IFRAME_CANVAS_MOUNT_ID}"`);
    expect(html).toContain("body {");
    expect(html).toContain("margin: 0;");
  });

  it("does not include app-shell stylesheet content", () => {
    const html = createIframeCanvasDocumentHtml({
      baseCss: PAGE_BASE_CSS,
    });

    expect(html).not.toContain('@import "tailwindcss"');
    expect(html).not.toContain("--pg_bg");
    expect(html).not.toContain("hoverblue");
  });
});
