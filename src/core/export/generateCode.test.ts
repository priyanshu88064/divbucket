import { describe, expect, it } from "vitest";
import {
  DOCUMENT_VERSION,
  type Document,
  type NodeRecord,
  type NodeStyleMap,
} from "@core/types/document";
import { generateCode, generateDocumentExport } from "./generateCode";

const emptyStateStyles = { default: {}, hover: {}, active: {} };

const baseRoot = {
  1: { type: "core:root", name: "Page" } as NodeRecord,
};

const makeStyleMap = (childStyle?: NodeStyleMap[number]): NodeStyleMap => ({
  1: {
    default: {
      width: "100%",
      minWidth: "300px",
      height: "500px",
      backgroundColor: "white",
    },
    hover: {},
    active: {},
  },
  2: childStyle || emptyStateStyles,
});

const makeDocument = ({
  tree = { 1: [2], 2: [] },
  dataMap,
  styleMap,
}: {
  tree?: Document["nodeChildrenMap"];
  dataMap: Document["nodeRecordMap"];
  styleMap: Document["nodeStyleMap"];
}): Document => ({
  version: DOCUMENT_VERSION,
  pageIds: [1],
  nodeChildrenMap: tree,
  nodeRecordMap: dataMap,
  nodeStyleMap: styleMap,
});

const runGenerate = ({
  child,
  childStyle,
  stylesheetMode = "external",
}: {
  child: NodeRecord;
  childStyle?: NodeStyleMap[number];
  stylesheetMode?: "internal" | "external";
}) =>
  generateDocumentExport({
    document: makeDocument({
      dataMap: { ...baseRoot, 2: child },
      styleMap: makeStyleMap(childStyle),
    }),
    pageId: 1,
    stylesheetMode,
  });

describe("generateDocumentExport", () => {
  it("generates semantic HTML for each runtime node kind", () => {
    const cases: Array<{ node: NodeRecord; expected: string }> = [
      {
        node: { type: "core:container", name: "core:container" },
        expected: '<div class="db-container-2"></div>',
      },
      { node: { type: "core:row", name: "core:row" }, expected: '<div class="db-row-2"></div>' },
      { node: { type: "core:heading", name: "core:heading", content: "H" }, expected: "<h1" },
      { node: { type: "core:text", name: "core:text", content: "T" }, expected: "<span" },
      { node: { type: "core:paragraph", name: "core:paragraph", content: "P" }, expected: "<p" },
      {
        node: {
          type: "core:image",
          name: "core:image",
          media: { src: "/x.png", alt: "img" },
        },
        expected: '<img class="db-image-2" src="/x.png" alt="img" />',
      },
      {
        node: {
          type: "core:video",
          name: "core:video",
          media: {
            src: "/x.mp4",
            controls: true,
            muted: true,
            autoPlay: true,
            loop: true,
          },
        },
        expected: '<video class="db-video-2" src="/x.mp4" controls loop autoplay muted></video>',
      },
      {
        node: { type: "core:button", name: "core:button", content: "Click" },
        expected: '<button class="db-button-2" type="button">Click</button>',
      },
      {
        node: { type: "core:list", name: "core:list" },
        expected: '<ul class="db-list-2"></ul>',
      },
      {
        node: { type: "core:listItem", name: "li", content: "Item" },
        expected: "<li",
      },
    ];

    for (const testCase of cases) {
      const result = runGenerate({ child: testCase.node });
      expect(result.html).toContain(testCase.expected);
    }
  });

  it("maps common style properties and pseudo states into deterministic CSS selectors", () => {
    const result = runGenerate({
      child: { type: "core:text", name: "copy", content: "Hello" },
      childStyle: {
        default: { marginTop: "10px", color: "#111111" },
        hover: { color: "#222222" },
        active: { color: "#333333" },
      },
    });

    expect(result.css).toContain(".db-text-2 {");
    expect(result.css).toContain("margin-top: 10px;");
    expect(result.css).toContain(".db-text-2:hover {");
    expect(result.css).toContain("color: #222222;");
    expect(result.css).toContain(".db-text-2:active {");
    expect(result.css).toContain("color: #333333;");
  });

  it("uses body selector for root and normalizes root height to 100vh", () => {
    const result = runGenerate({
      child: { type: "core:text", name: "copy", content: "Hello" },
    });

    expect(result.css).toContain("body {");
    expect(result.css).toContain("height: 100vh;");
    expect(result.css).toContain("background-color: white;");
    expect(result.css).not.toContain("width: 100%;");
    expect(result.css).not.toContain("min-width: 300px;");
  });

  it("embeds css when internal stylesheet output is requested", () => {
    const result = runGenerate({
      child: { type: "core:text", name: "copy", content: "Hello" },
      stylesheetMode: "internal",
    });

    expect(result.html).toContain("<style>");
    expect(result.html).toContain("body {");
  });

  it("escapes text and attributes in generated output", () => {
    const result = generateDocumentExport({
      document: makeDocument({
        dataMap: {
          1: { type: "core:root", name: `Unsafe <Title> "quoted"` },
          2: {
            type: "core:text",
            name: "unsafe",
            content: `Hello <script> & "quotes" and 'single'`,
          },
        },
        styleMap: makeStyleMap(),
      }),
      pageId: 1,
      stylesheetMode: "external",
    });

    expect(result.html).toContain(
      "<title>Unsafe &lt;Title&gt; &quot;quoted&quot;</title>",
    );
    expect(result.html).toContain(
      `Hello &lt;script&gt; &amp; &quot;quotes&quot; and &#39;single&#39;`,
    );
  });

  it("omits undefined/empty media attributes and emits truthy video flags only", () => {
    const imageResult = runGenerate({
      child: {
        type: "core:image",
        name: "core:image",
        media: { src: "", alt: "" },
      },
    });

    expect(imageResult.html).toContain('<img class="db-image-2" />');
    expect(imageResult.html).not.toContain('src=""');
    expect(imageResult.html).not.toContain('alt=""');

    const videoResult = runGenerate({
      child: {
        type: "core:video",
        name: "core:video",
        media: { src: "/v.mp4", controls: true, autoPlay: false, loop: true },
      },
    });

    expect(videoResult.html).toContain(
      '<video class="db-video-2" src="/v.mp4" controls loop></video>',
    );
    expect(videoResult.html).not.toContain("autoplay");
    expect(videoResult.html).not.toContain("muted");
  });

  it("uses generator-owned class names instead of user-editable node names", () => {
    const result = runGenerate({
      child: {
        type: "core:text",
        name: `bad class'"><script>alert(1)</script>`,
        content: "safe",
      },
      childStyle: {
        default: { color: "#111111" },
        hover: {},
        active: {},
      },
    });

    expect(result.html).toContain('class="db-text-2"');
    expect(result.html).not.toContain("bad class");
    expect(result.css).toContain(".db-text-2");
  });

  it("ignores editor-only styleUi metadata during HTML/CSS generation", () => {
    const result = generateDocumentExport({
      document: makeDocument({
        dataMap: {
          1: { type: "core:root", name: "Page" },
          2: {
            type: "core:button",
            name: "cta",
            content: "Click",
            styleUi: {
              background: { mode: "Solid" },
              spacing: { margin: { linkMode: "all" } },
            },
          },
        },
        styleMap: {
          1: {
            default: { height: "500px", backgroundColor: "white" },
            hover: {},
            active: {},
          },
          2: {
            default: { backgroundColor: "#111111", color: "#ffffff" },
            hover: {},
            active: {},
          },
        },
      }),
      pageId: 1,
      stylesheetMode: "external",
    });

    expect(result.css).toContain("background-color: #111111;");
    expect(result.css).not.toContain("styleUi");
    expect(result.html).not.toContain("styleUi");
  });

  it("keeps legacy generateCode API compatible with document export output", () => {
    const legacy = generateCode({
      tree: { 1: [2], 2: [] },
      dataMap: {
        1: { type: "core:root", name: "Page" },
        2: { type: "core:paragraph", name: "body", content: "Hello" },
      },
      styleMap: makeStyleMap(),
      tab: 1,
      isInternalStyleSheet: false,
    });

    const modern = generateDocumentExport({
      document: makeDocument({
        dataMap: {
          1: { type: "core:root", name: "Page" },
          2: { type: "core:paragraph", name: "body", content: "Hello" },
        },
        styleMap: makeStyleMap(),
      }),
      pageId: 1,
      stylesheetMode: "external",
    });

    expect(legacy).toEqual(modern);
  });

  it("generates stable structure for a simple text page", () => {
    const result = generateDocumentExport({
      document: makeDocument({
        tree: { 1: [2], 2: [] },
        dataMap: {
          1: { type: "core:root", name: "Simple" },
          2: { type: "core:text", name: "label", content: "Hello world" },
        },
        styleMap: makeStyleMap({
          default: { color: "#111111" },
          hover: {},
          active: {},
        }),
      }),
      pageId: 1,
      stylesheetMode: "external",
    });

    expect(result.documentHtml).toBe(result.html);
    expect(result.bodyHtml).toContain('<span class="db-text-2">Hello world</span>');
    expect(result.html).toContain("<title>Simple</title>");
    expect(result.css).toContain(".db-text-2 {");
    expect(result.css).toContain("color: #111111;");
  });

  it("generates stable structure for a mixed media page", () => {
    const result = generateDocumentExport({
      document: makeDocument({
        tree: { 1: [2, 3], 2: [], 3: [] },
        dataMap: {
          1: { type: "core:root", name: "Media" },
          2: {
            type: "core:image",
            name: "hero image",
            media: { src: "https://cdn.example/x.png", alt: `A "hero"` },
          },
          3: {
            type: "core:video",
            name: "clip",
            media: { src: "/clip.mp4", controls: true, muted: true },
          },
        },
        styleMap: {
          1: makeStyleMap()[1],
          2: emptyStateStyles,
          3: emptyStateStyles,
        },
      }),
      pageId: 1,
      stylesheetMode: "external",
    });

    expect(result.bodyHtml).toContain(
      '<img class="db-image-2" src="https://cdn.example/x.png" alt="A &quot;hero&quot;" />',
    );
    expect(result.bodyHtml).toContain(
      '<video class="db-video-3" src="/clip.mp4" controls muted></video>',
    );
    expect(result.html).toContain("<title>Media</title>");
    expect(result.css).toContain("body {");
  });

  it("generates stable structure for a nested container/list page", () => {
    const result = generateDocumentExport({
      document: makeDocument({
        tree: { 1: [2], 2: [3], 3: [4, 5], 4: [], 5: [] },
        dataMap: {
          1: { type: "core:root", name: "Nested" },
          2: { type: "core:container", name: "wrapper" },
          3: { type: "core:list", name: "items" },
          4: { type: "core:listItem", name: "a", content: "One" },
          5: { type: "core:listItem", name: "b", content: "Two" },
        },
        styleMap: {
          1: makeStyleMap()[1],
          2: emptyStateStyles,
          3: emptyStateStyles,
          4: emptyStateStyles,
          5: emptyStateStyles,
        },
      }),
      pageId: 1,
      stylesheetMode: "external",
    });

    expect(result.bodyHtml).toContain('<div class="db-container-2">');
    expect(result.bodyHtml).toContain('<ul class="db-list-3">');
    expect(result.bodyHtml).toContain('<li class="db-listItem-4">One</li>');
    expect(result.bodyHtml).toContain('<li class="db-listItem-5">Two</li>');
    expect(result.html).toContain("<title>Nested</title>");
  });
});
