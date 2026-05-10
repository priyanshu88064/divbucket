import { describe, expect, it } from "vitest";
import { assemblePageDocument } from "./pageDocumentShell";

describe("assemblePageDocument", () => {
  it("builds a complete HTML document with optional stylesheet and inline css", () => {
    const html = assemblePageDocument({
      title: `Unsafe <Title> "quoted"`,
      bodyHtml: "<body><div>Hello</div></body>",
      stylesheetHref: "style.css",
      inlineCss: "body { margin: 0; }",
    });

    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain('<link rel="stylesheet" href="style.css">');
    expect(html).toContain("<style>");
    expect(html).toContain("body { margin: 0; }");
    expect(html).toContain("<body><div>Hello</div></body>");
    expect(html).toContain("<title>Unsafe &lt;Title&gt; &quot;quoted&quot;</title>");
  });

  it("omits stylesheet and inline style blocks when not provided", () => {
    const html = assemblePageDocument({
      title: "No Style",
      bodyHtml: "<body></body>",
      stylesheetHref: null,
      inlineCss: null,
    });

    expect(html).not.toContain("rel=\"stylesheet\"");
    expect(html).not.toContain("<style>");
  });
});

