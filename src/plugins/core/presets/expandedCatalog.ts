import type { CSSProperties } from "react";
import type { PresetDefinition } from "@core/kernel/types";
import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "./shared/templateHelpers";
import { createStaticSubtreePresetDefinition } from "./shared/createStaticSubtreePresetDefinition";
import { PRESET_GROUPS } from "./shared/groups";

const solidBackgroundStyleUi = {
  background: { mode: "Solid" as const },
};

const customBackgroundStyleUi = {
  background: { mode: "Custom" as const },
};

const bucket = (
  defaultStyle: CSSProperties,
  hover: CSSProperties = {},
  active: CSSProperties = {},
): Template["nodeStyleMap"][number] => ({
  default: defaultStyle,
  hover,
  active,
});

const createBlocks = ({ createRecord, createStyle }: PresetTemplateHelpers) => ({
  container: () => createRecord("core:container"),
  row: () => createRecord("core:row"),
  text: (content: string) => ({ ...createRecord("core:text"), content }),
  heading: (content: string) => ({ ...createRecord("core:heading"), content }),
  paragraph: (content: string) => ({
    ...createRecord("core:paragraph"),
    content,
  }),
  button: (content: string) => ({
    ...createRecord("core:button"),
    content,
    styleUi: solidBackgroundStyleUi,
  }),
  image: (src: string, alt: string) => ({
    ...createRecord("core:image"),
    media: { src, alt },
  }),
  list: () => createRecord("core:list"),
  listItem: (content: string) => ({
    ...createRecord("core:listItem"),
    content,
  }),
  style: (kind: Parameters<typeof createStyle>[0], override: CSSProperties) => ({
    ...createStyle(kind),
    ...override,
  }),
});

const announcementBarTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2], 1: [], 2: [] },
    nodeRecordMap: {
      0: { ...b.row(), name: "Announcement Bar", styleUi: customBackgroundStyleUi },
      1: { ...b.text("Fresh layouts just landed. Build faster with new presets."), name: "Announcement Copy" },
      2: { ...b.button("Explore"), name: "Announcement Button" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:row", {
          width: "100%",
          paddingTop: "14px",
          paddingRight: "18px",
          paddingBottom: "14px",
          paddingLeft: "18px",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          background:
            "linear-gradient(135deg, #171717 0%, #3a3a3a 45%, #0f766e 100%)",
          color: "#ffffff",
          borderRadius: "18px",
          flexWrap: "wrap",
        }),
      ),
      1: bucket(
        b.style("core:text", {
          fontSize: "13px",
          color: "#ffffff",
          fontWeight: "500",
        }),
      ),
      2: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "8px",
          paddingRight: "14px",
          paddingBottom: "8px",
          paddingLeft: "14px",
          backgroundColor: "#ffffff",
          color: "#171717",
          borderRadius: "999px",
          cursor: "pointer",
          fontWeight: "600",
        }),
        { opacity: "0.92" },
      ),
    },
  };
};

const featureTileTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2, 3, 4], 1: [], 2: [], 3: [], 4: [] },
    nodeRecordMap: {
      0: { ...b.container(), name: "Feature Tile", styleUi: solidBackgroundStyleUi },
      1: { ...b.text("EDITORIAL"), name: "Eyebrow" },
      2: { ...b.heading("A sharply styled content tile"), name: "Feature Title" },
      3: {
        ...b.paragraph(
          "Use this for featured links, promos, or mini landing blocks with a bit more attitude.",
        ),
        name: "Feature Copy",
      },
      4: { ...b.button("Open Story"), name: "Feature CTA" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "320px",
          paddingTop: "22px",
          paddingRight: "22px",
          paddingBottom: "22px",
          paddingLeft: "22px",
          backgroundColor: "#f7efe4",
          borderRadius: "24px",
          boxShadow: "0 10px 15px #00000018",
        }),
      ),
      1: bucket(
        b.style("core:text", {
          fontSize: "11px",
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "4px",
          color: "#8b5e34",
        }),
      ),
      2: bucket(
        b.style("core:heading", {
          fontSize: "28px",
          fontWeight: "bolder",
          marginTop: "14px",
          color: "#24190f",
          maxWidth: "260px",
        }),
      ),
      3: bucket(
        b.style("core:paragraph", {
          fontSize: "13px",
          marginTop: "14px",
          color: "#4f4033",
          maxWidth: "270px",
        }),
      ),
      4: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "8px",
          paddingRight: "14px",
          paddingBottom: "8px",
          paddingLeft: "14px",
          marginTop: "20px",
          backgroundColor: "#24190f",
          color: "#ffffff",
          borderRadius: "999px",
          cursor: "pointer",
          fontSize: "12px",
        }),
      ),
    },
  };
};

const metricCardTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2, 3], 1: [], 2: [], 3: [] },
    nodeRecordMap: {
      0: { ...b.container(), name: "Metric Card", styleUi: solidBackgroundStyleUi },
      1: { ...b.text("+148%"), name: "Metric Value" },
      2: { ...b.heading("Engagement Lift"), name: "Metric Label" },
      3: {
        ...b.paragraph("Pair this with feature rows, dashboards, or proof-heavy sections."),
        name: "Metric Copy",
      },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "240px",
          paddingTop: "24px",
          paddingRight: "24px",
          paddingBottom: "24px",
          paddingLeft: "24px",
          backgroundColor: "#131b2e",
          color: "#ffffff",
          borderRadius: "22px",
        }),
      ),
      1: bucket(
        b.style("core:text", {
          fontSize: "42px",
          fontWeight: "bolder",
          color: "#73f0c2",
        }),
      ),
      2: bucket(
        b.style("core:heading", {
          fontSize: "18px",
          fontWeight: "600",
          marginTop: "10px",
          color: "#ffffff",
        }),
      ),
      3: bucket(
        b.style("core:paragraph", {
          fontSize: "12px",
          marginTop: "12px",
          color: "#cbd5e1",
        }),
      ),
    },
  };
};

const mediaCardTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2, 3, 4], 1: [], 2: [], 3: [], 4: [] },
    nodeRecordMap: {
      0: { ...b.container(), name: "Media Card" },
      1: {
        ...b.image("https://picsum.photos/id/64/640/420", "Minimal interior"),
        name: "Media Cover",
      },
      2: { ...b.heading("A magazine-style promo block"), name: "Media Title" },
      3: {
        ...b.paragraph("Mix image-led storytelling with a short summary and a compact call to action."),
        name: "Media Copy",
      },
      4: { ...b.button("Read Feature"), name: "Media CTA" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "300px",
          paddingTop: "14px",
          paddingRight: "14px",
          paddingBottom: "20px",
          paddingLeft: "14px",
          borderRadius: "24px",
          boxShadow: "0 10px 15px #00000014",
          backgroundColor: "#ffffff",
        }),
      ),
      1: bucket(
        b.style("core:image", {
          width: "100%",
          height: "180px",
          objectFit: "cover",
          borderRadius: "18px",
        }),
      ),
      2: bucket(
        b.style("core:heading", {
          fontSize: "22px",
          marginTop: "18px",
          color: "#111827",
          fontWeight: "700",
        }),
      ),
      3: bucket(
        b.style("core:paragraph", {
          fontSize: "12px",
          marginTop: "12px",
          color: "#4b5563",
        }),
      ),
      4: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "8px",
          paddingRight: "14px",
          paddingBottom: "8px",
          paddingLeft: "14px",
          marginTop: "18px",
          backgroundColor: "#111827",
          color: "#ffffff",
          borderRadius: "999px",
          cursor: "pointer",
          fontSize: "12px",
        }),
      ),
    },
  };
};

const testimonialCardTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2, 3], 1: [], 2: [], 3: [] },
    nodeRecordMap: {
      0: { ...b.container(), name: "Testimonial Card", styleUi: solidBackgroundStyleUi },
      1: { ...b.text("“"), name: "Quote Mark" },
      2: {
        ...b.paragraph(
          "This builder feels unusually fast. We went from rough idea to a polished landing page in a single afternoon.",
        ),
        name: "Quote",
      },
      3: { ...b.text("Mina Patel, Product Marketing"), name: "Author" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "320px",
          paddingTop: "24px",
          paddingRight: "24px",
          paddingBottom: "24px",
          paddingLeft: "24px",
          backgroundColor: "#f1f5f9",
          borderRadius: "24px",
        }),
      ),
      1: bucket(
        b.style("core:text", {
          fontSize: "48px",
          color: "#0f172a",
          height: "34px",
          fontWeight: "bolder",
        }),
      ),
      2: bucket(
        b.style("core:paragraph", {
          fontSize: "15px",
          color: "#1e293b",
          marginTop: "10px",
          maxWidth: "260px",
        }),
      ),
      3: bucket(
        b.style("core:text", {
          fontSize: "11px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "2px",
          color: "#475569",
          marginTop: "18px",
        }),
      ),
    },
  };
};

const pricingCardTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2, 3, 4],
      1: [],
      2: [],
      3: [5, 6, 7],
      4: [],
      5: [],
      6: [],
      7: [],
    },
    nodeRecordMap: {
      0: { ...b.container(), name: "Pricing Card", styleUi: solidBackgroundStyleUi },
      1: { ...b.text("PRO"), name: "Plan Tag" },
      2: { ...b.heading("$48/mo"), name: "Plan Price" },
      3: { ...b.list(), name: "Plan Features" },
      4: { ...b.button("Choose Plan"), name: "Plan CTA" },
      5: { ...b.listItem("Unlimited sections"), name: "Feature One" },
      6: { ...b.listItem("Responsive editing"), name: "Feature Two" },
      7: { ...b.listItem("Priority support"), name: "Feature Three" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "280px",
          paddingTop: "24px",
          paddingRight: "24px",
          paddingBottom: "24px",
          paddingLeft: "24px",
          backgroundColor: "#fff8eb",
          borderRadius: "26px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#f2d6a2",
        }),
      ),
      1: bucket(
        b.style("core:text", {
          width: "fit-content",
          paddingTop: "4px",
          paddingRight: "10px",
          paddingBottom: "4px",
          paddingLeft: "10px",
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase",
          background: "#1f2937",
          color: "#ffffff",
          borderRadius: "999px",
        }),
      ),
      2: bucket(
        b.style("core:heading", {
          fontSize: "32px",
          color: "#1f2937",
          marginTop: "16px",
        }),
      ),
      3: bucket(
        b.style("core:list", {
          marginTop: "18px",
          paddingLeft: "16px",
        }),
      ),
      4: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "10px",
          paddingRight: "16px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          marginTop: "20px",
          backgroundColor: "#1f2937",
          color: "#ffffff",
          borderRadius: "999px",
          cursor: "pointer",
          fontSize: "12px",
        }),
      ),
      5: bucket(b.style("core:listItem", { fontSize: "12px", color: "#4b5563", marginTop: "6px" })),
      6: bucket(b.style("core:listItem", { fontSize: "12px", color: "#4b5563", marginTop: "6px" })),
      7: bucket(b.style("core:listItem", { fontSize: "12px", color: "#4b5563", marginTop: "6px" })),
    },
  };
};

const splitHeroTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2],
      1: [3, 4, 5],
      2: [],
      3: [],
      4: [],
      5: [6, 7],
      6: [],
      7: [],
    },
    nodeRecordMap: {
      0: { ...b.row(), name: "Split Hero", styleUi: customBackgroundStyleUi },
      1: { ...b.container(), name: "Hero Content" },
      2: { ...b.image("https://picsum.photos/id/1067/960/1080", "Portrait product shot"), name: "Hero Image" },
      3: { ...b.text("NEW COLLECTION"), name: "Hero Eyebrow" },
      4: { ...b.heading("Confident layouts for sharp, visual landing pages"), name: "Hero Heading" },
      5: { ...b.row(), name: "Hero Actions" },
      6: { ...b.button("Start Free"), name: "Primary CTA" },
      7: { ...b.button("See Templates"), name: "Secondary CTA", styleUi: solidBackgroundStyleUi },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:row", {
          width: "100%",
          paddingTop: "44px",
          paddingRight: "44px",
          paddingBottom: "44px",
          paddingLeft: "44px",
          background:
            "linear-gradient(135deg, #f9f2e7 0%, #f7d6c7 52%, #f2c59f 100%)",
          borderRadius: "32px",
          gap: "32px",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }),
      ),
      1: bucket(
        b.style("core:container", {
          width: "420px",
          minHeight: "20px",
        }),
      ),
      2: bucket(
        b.style("core:image", {
          width: "360px",
          height: "460px",
          objectFit: "cover",
          borderRadius: "28px",
          boxShadow: "0 25px 50px #0000001a",
        }),
      ),
      3: bucket(
        b.style("core:text", {
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "#7c2d12",
        }),
      ),
      4: bucket(
        b.style("core:heading", {
          fontSize: "42px",
          marginTop: "18px",
          color: "#1c1917",
          fontWeight: "bolder",
        }),
      ),
      5: bucket(
        b.style("core:row", {
          gap: "14px",
          marginTop: "24px",
          flexWrap: "wrap",
          alignItems: "center",
        }),
      ),
      6: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "10px",
          paddingRight: "18px",
          paddingBottom: "10px",
          paddingLeft: "18px",
          backgroundColor: "#1c1917",
          color: "#ffffff",
          borderRadius: "999px",
          cursor: "pointer",
        }),
      ),
      7: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "10px",
          paddingRight: "18px",
          paddingBottom: "10px",
          paddingLeft: "18px",
          backgroundColor: "#ffffff",
          color: "#1c1917",
          borderRadius: "999px",
          cursor: "pointer",
        }),
      ),
    },
  };
};

const ctaBannerTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2, 3], 1: [], 2: [], 3: [] },
    nodeRecordMap: {
      0: { ...b.row(), name: "CTA Banner", styleUi: customBackgroundStyleUi },
      1: { ...b.heading("Ready to ship something cleaner?"), name: "CTA Title" },
      2: {
        ...b.paragraph("Turn a rough concept into a polished page with reusable sections and components."),
        name: "CTA Copy",
      },
      3: { ...b.button("Launch Builder"), name: "CTA Button" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:row", {
          width: "100%",
          paddingTop: "28px",
          paddingRight: "32px",
          paddingBottom: "28px",
          paddingLeft: "32px",
          background:
            "linear-gradient(120deg, #082f49 0%, #0f766e 50%, #34d399 100%)",
          borderRadius: "28px",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
        }),
      ),
      1: bucket(
        b.style("core:heading", {
          width: "330px",
          fontSize: "28px",
          color: "#ffffff",
          fontWeight: "bolder",
        }),
      ),
      2: bucket(
        b.style("core:paragraph", {
          width: "320px",
          fontSize: "12px",
          color: "#d1fae5",
        }),
      ),
      3: bucket(
        b.style("core:button", {
          width: "fit-content",
          paddingTop: "10px",
          paddingRight: "18px",
          paddingBottom: "10px",
          paddingLeft: "18px",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          borderRadius: "999px",
          cursor: "pointer",
          fontWeight: "600",
        }),
      ),
    },
  };
};

const logoCloudTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2],
      1: [],
      2: [3, 4, 5, 6, 7],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
    },
    nodeRecordMap: {
      0: { ...b.container(), name: "Logo Cloud" },
      1: { ...b.text("Trusted by creative teams and product studios"), name: "Cloud Intro" },
      2: { ...b.row(), name: "Logo Row" },
      3: { ...b.text("MONO"), name: "Logo One" },
      4: { ...b.text("AXIS"), name: "Logo Two" },
      5: { ...b.text("NOVA"), name: "Logo Three" },
      6: { ...b.text("FRAME"), name: "Logo Four" },
      7: { ...b.text("TERRA"), name: "Logo Five" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "100%",
          paddingTop: "30px",
          paddingRight: "20px",
          paddingBottom: "30px",
          paddingLeft: "20px",
        }),
      ),
      1: bucket(
        b.style("core:text", {
          textAlign: "center",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "3px",
          color: "#64748b",
          fontWeight: "700",
        }),
      ),
      2: bucket(
        b.style("core:row", {
          marginTop: "22px",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }),
      ),
      3: bucket(b.style("core:text", { fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "2px" })),
      4: bucket(b.style("core:text", { fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "2px" })),
      5: bucket(b.style("core:text", { fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "2px" })),
      6: bucket(b.style("core:text", { fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "2px" })),
      7: bucket(b.style("core:text", { fontSize: "18px", fontWeight: "700", color: "#0f172a", letterSpacing: "2px" })),
    },
  };
};

const statsBandTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2, 3],
      1: [4, 5],
      2: [6, 7],
      3: [8, 9],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    },
    nodeRecordMap: {
      0: { ...b.row(), name: "Stats Band", styleUi: solidBackgroundStyleUi },
      1: { ...b.container(), name: "Stat One" },
      2: { ...b.container(), name: "Stat Two" },
      3: { ...b.container(), name: "Stat Three" },
      4: { ...b.text("24h"), name: "Value One" },
      5: { ...b.paragraph("Average launch turnaround"), name: "Copy One" },
      6: { ...b.text("89"), name: "Value Two" },
      7: { ...b.paragraph("Reusable presets in your palette"), name: "Copy Two" },
      8: { ...b.text("4.9/5"), name: "Value Three" },
      9: { ...b.paragraph("Builder satisfaction from design teams"), name: "Copy Three" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:row", {
          width: "100%",
          paddingTop: "24px",
          paddingRight: "24px",
          paddingBottom: "24px",
          paddingLeft: "24px",
          backgroundColor: "#111827",
          borderRadius: "28px",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
        }),
      ),
      1: bucket(b.style("core:container", { width: "220px" })),
      2: bucket(b.style("core:container", { width: "220px" })),
      3: bucket(b.style("core:container", { width: "220px" })),
      4: bucket(b.style("core:text", { fontSize: "36px", color: "#ffffff", fontWeight: "bolder" })),
      5: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "8px", color: "#9ca3af" })),
      6: bucket(b.style("core:text", { fontSize: "36px", color: "#ffffff", fontWeight: "bolder" })),
      7: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "8px", color: "#9ca3af" })),
      8: bucket(b.style("core:text", { fontSize: "36px", color: "#ffffff", fontWeight: "bolder" })),
      9: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "8px", color: "#9ca3af" })),
    },
  };
};

const featureGridTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2, 3, 4, 5],
      1: [],
      2: [],
      3: [6, 7],
      4: [8, 9],
      5: [10, 11],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
    },
    nodeRecordMap: {
      0: { ...b.container(), name: "Feature Grid" },
      1: { ...b.text("WHY BUILD HERE"), name: "Grid Intro" },
      2: { ...b.heading("A balanced section for three punchy selling points"), name: "Grid Title" },
      3: { ...b.container(), name: "Tile One", styleUi: solidBackgroundStyleUi },
      4: { ...b.container(), name: "Tile Two", styleUi: solidBackgroundStyleUi },
      5: { ...b.container(), name: "Tile Three", styleUi: solidBackgroundStyleUi },
      6: { ...b.text("FAST"), name: "Tile One Tag" },
      7: { ...b.paragraph("Ship ideas without fighting structure every time you need a new section."), name: "Tile One Copy" },
      8: { ...b.text("FLEXIBLE"), name: "Tile Two Tag" },
      9: { ...b.paragraph("Mix layouts, components, and content blocks into one coherent page system."), name: "Tile Two Copy" },
      10: { ...b.text("VISUAL"), name: "Tile Three Tag" },
      11: { ...b.paragraph("Make pages feel composed, not generic, with stronger default arrangements."), name: "Tile Three Copy" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:container", {
          width: "100%",
          paddingTop: "24px",
          paddingRight: "8px",
          paddingBottom: "24px",
          paddingLeft: "8px",
        }),
      ),
      1: bucket(b.style("core:text", { textAlign: "center", fontSize: "11px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", color: "#7c3aed" })),
      2: bucket(b.style("core:heading", { textAlign: "center", fontSize: "30px", fontWeight: "bolder", color: "#111827", width: "90%", maxWidth: "680px", marginTop: "14px", marginLeft: "auto", marginRight: "auto" })),
      3: bucket(b.style("core:container", { width: "30%", minWidth: "220px", display: "inline-block", backgroundColor: "#ede9fe", borderRadius: "22px", paddingTop: "22px", paddingRight: "18px", paddingBottom: "22px", paddingLeft: "18px", marginTop: "24px", marginRight: "12px" })),
      4: bucket(b.style("core:container", { width: "30%", minWidth: "220px", display: "inline-block", backgroundColor: "#e0f2fe", borderRadius: "22px", paddingTop: "22px", paddingRight: "18px", paddingBottom: "22px", paddingLeft: "18px", marginTop: "24px", marginRight: "12px" })),
      5: bucket(b.style("core:container", { width: "30%", minWidth: "220px", display: "inline-block", backgroundColor: "#dcfce7", borderRadius: "22px", paddingTop: "22px", paddingRight: "18px", paddingBottom: "22px", paddingLeft: "18px", marginTop: "24px" })),
      6: bucket(b.style("core:text", { fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#4c1d95" })),
      7: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "14px", color: "#312e81" })),
      8: bucket(b.style("core:text", { fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#0c4a6e" })),
      9: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "14px", color: "#0f172a" })),
      10: bucket(b.style("core:text", { fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#166534" })),
      11: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "14px", color: "#14532d" })),
    },
  };
};

const galleryRailTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: { 0: [1, 2, 3], 1: [], 2: [], 3: [] },
    nodeRecordMap: {
      0: { ...b.row(), name: "Gallery Rail" },
      1: { ...b.image("https://picsum.photos/id/1025/640/820", "Gallery image one"), name: "Gallery One" },
      2: { ...b.image("https://picsum.photos/id/1011/640/820", "Gallery image two"), name: "Gallery Two" },
      3: { ...b.image("https://picsum.photos/id/1005/640/820", "Gallery image three"), name: "Gallery Three" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:row", {
          width: "100%",
          gap: "18px",
          alignItems: "stretch",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }),
      ),
      1: bucket(b.style("core:image", { width: "31%", minWidth: "220px", height: "360px", objectFit: "cover", borderRadius: "24px" })),
      2: bucket(b.style("core:image", { width: "31%", minWidth: "220px", height: "360px", objectFit: "cover", borderRadius: "24px" })),
      3: bucket(b.style("core:image", { width: "31%", minWidth: "220px", height: "360px", objectFit: "cover", borderRadius: "24px" })),
    },
  };
};

const faqSectionTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2, 3, 4],
      1: [],
      2: [5, 6],
      3: [7, 8],
      4: [9, 10],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
    },
    nodeRecordMap: {
      0: { ...b.container(), name: "FAQ Section" },
      1: { ...b.heading("Questions people usually ask first"), name: "FAQ Title" },
      2: { ...b.container(), name: "FAQ One", styleUi: solidBackgroundStyleUi },
      3: { ...b.container(), name: "FAQ Two", styleUi: solidBackgroundStyleUi },
      4: { ...b.container(), name: "FAQ Three", styleUi: solidBackgroundStyleUi },
      5: { ...b.text("Can I reuse these layouts across pages?"), name: "FAQ One Question" },
      6: { ...b.paragraph("Yes. They are presets, so you can drop them wherever you need and customize them in place."), name: "FAQ One Answer" },
      7: { ...b.text("Do they export clean HTML and CSS?"), name: "FAQ Two Question" },
      8: { ...b.paragraph("They use the same node and style pipeline as the rest of the builder, so export stays consistent."), name: "FAQ Two Answer" },
      9: { ...b.text("Can I remix them into new sections?"), name: "FAQ Three Question" },
      10: { ...b.paragraph("Absolutely. The idea is to treat them like a starting kit, not a locked pattern library."), name: "FAQ Three Answer" },
    },
    nodeStyleMap: {
      0: bucket(b.style("core:container", { width: "100%", paddingTop: "16px", paddingBottom: "16px" })),
      1: bucket(b.style("core:heading", { textAlign: "center", fontSize: "30px", fontWeight: "bolder", color: "#0f172a", width: "90%", maxWidth: "720px", marginLeft: "auto", marginRight: "auto" })),
      2: bucket(b.style("core:container", { backgroundColor: "#f8fafc", borderRadius: "20px", paddingTop: "18px", paddingRight: "18px", paddingBottom: "18px", paddingLeft: "18px", marginTop: "22px" })),
      3: bucket(b.style("core:container", { backgroundColor: "#f8fafc", borderRadius: "20px", paddingTop: "18px", paddingRight: "18px", paddingBottom: "18px", paddingLeft: "18px", marginTop: "14px" })),
      4: bucket(b.style("core:container", { backgroundColor: "#f8fafc", borderRadius: "20px", paddingTop: "18px", paddingRight: "18px", paddingBottom: "18px", paddingLeft: "18px", marginTop: "14px" })),
      5: bucket(b.style("core:text", { fontSize: "15px", fontWeight: "700", color: "#111827" })),
      6: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "10px", color: "#475569" })),
      7: bucket(b.style("core:text", { fontSize: "15px", fontWeight: "700", color: "#111827" })),
      8: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "10px", color: "#475569" })),
      9: bucket(b.style("core:text", { fontSize: "15px", fontWeight: "700", color: "#111827" })),
      10: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "10px", color: "#475569" })),
    },
  };
};

const testimonialTrioTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2, 3, 4],
      1: [],
      2: [5, 6],
      3: [7, 8],
      4: [9, 10],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
    },
    nodeRecordMap: {
      0: { ...b.container(), name: "Testimonial Trio" },
      1: { ...b.heading("Social proof without the usual boring grid"), name: "Testimonial Trio Title" },
      2: { ...b.container(), name: "Story One", styleUi: solidBackgroundStyleUi },
      3: { ...b.container(), name: "Story Two", styleUi: solidBackgroundStyleUi },
      4: { ...b.container(), name: "Story Three", styleUi: solidBackgroundStyleUi },
      5: { ...b.paragraph("“The preset library made our first draft feel real in minutes instead of hours.”"), name: "Story One Quote" },
      6: { ...b.text("Ari, Founder"), name: "Story One Author" },
      7: { ...b.paragraph("“It finally feels like a builder that understands composition, not just stacking boxes.”"), name: "Story Two Quote" },
      8: { ...b.text("Lina, Designer"), name: "Story Two Author" },
      9: { ...b.paragraph("“We reused the same sections across launch, docs, and campaign pages with minimal cleanup.”"), name: "Story Three Quote" },
      10: { ...b.text("Dev, Marketing Lead"), name: "Story Three Author" },
    },
    nodeStyleMap: {
      0: bucket(b.style("core:container", { width: "100%", paddingTop: "16px", paddingBottom: "16px" })),
      1: bucket(b.style("core:heading", { textAlign: "center", fontSize: "30px", fontWeight: "bolder", color: "#111827", width: "90%", maxWidth: "700px", marginLeft: "auto", marginRight: "auto" })),
      2: bucket(b.style("core:container", { width: "31%", minWidth: "220px", display: "inline-block", backgroundColor: "#f8fafc", borderRadius: "22px", paddingTop: "20px", paddingRight: "20px", paddingBottom: "20px", paddingLeft: "20px", marginTop: "24px", marginRight: "12px" })),
      3: bucket(b.style("core:container", { width: "31%", minWidth: "220px", display: "inline-block", backgroundColor: "#fef2f2", borderRadius: "22px", paddingTop: "20px", paddingRight: "20px", paddingBottom: "20px", paddingLeft: "20px", marginTop: "24px", marginRight: "12px" })),
      4: bucket(b.style("core:container", { width: "31%", minWidth: "220px", display: "inline-block", backgroundColor: "#eff6ff", borderRadius: "22px", paddingTop: "20px", paddingRight: "20px", paddingBottom: "20px", paddingLeft: "20px", marginTop: "24px" })),
      5: bucket(b.style("core:paragraph", { fontSize: "14px", color: "#0f172a" })),
      6: bucket(b.style("core:text", { fontSize: "11px", marginTop: "18px", textTransform: "uppercase", letterSpacing: "2px", color: "#475569", fontWeight: "700" })),
      7: bucket(b.style("core:paragraph", { fontSize: "14px", color: "#7f1d1d" })),
      8: bucket(b.style("core:text", { fontSize: "11px", marginTop: "18px", textTransform: "uppercase", letterSpacing: "2px", color: "#7f1d1d", fontWeight: "700" })),
      9: bucket(b.style("core:paragraph", { fontSize: "14px", color: "#1e3a8a" })),
      10: bucket(b.style("core:text", { fontSize: "11px", marginTop: "18px", textTransform: "uppercase", letterSpacing: "2px", color: "#1d4ed8", fontWeight: "700" })),
    },
  };
};

const footerColumnsTemplate = (helpers: PresetTemplateHelpers): Template => {
  const b = createBlocks(helpers);

  return {
    nodeChildrenMap: {
      0: [1, 2, 3, 4],
      1: [5],
      2: [6, 7, 8],
      3: [9, 10, 11],
      4: [12, 13, 14],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
      11: [],
      12: [],
      13: [],
      14: [],
    },
    nodeRecordMap: {
      0: { ...b.row(), name: "Footer Columns", styleUi: solidBackgroundStyleUi },
      1: { ...b.container(), name: "Brand Column" },
      2: { ...b.container(), name: "Product Column" },
      3: { ...b.container(), name: "Company Column" },
      4: { ...b.container(), name: "Social Column" },
      5: { ...b.heading("Divbucket"), name: "Footer Brand" },
      6: { ...b.text("Product"), name: "Product Heading" },
      7: { ...b.paragraph("Layouts"), name: "Product Link One" },
      8: { ...b.paragraph("Components"), name: "Product Link Two" },
      9: { ...b.text("Company"), name: "Company Heading" },
      10: { ...b.paragraph("About"), name: "Company Link One" },
      11: { ...b.paragraph("Contact"), name: "Company Link Two" },
      12: { ...b.text("Follow"), name: "Social Heading" },
      13: { ...b.paragraph("Instagram"), name: "Social Link One" },
      14: { ...b.paragraph("Behance"), name: "Social Link Two" },
    },
    nodeStyleMap: {
      0: bucket(
        b.style("core:row", {
          width: "100%",
          paddingTop: "30px",
          paddingRight: "24px",
          paddingBottom: "30px",
          paddingLeft: "24px",
          backgroundColor: "#0f172a",
          borderRadius: "28px",
          color: "#ffffff",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
        }),
      ),
      1: bucket(b.style("core:container", { width: "220px" })),
      2: bucket(b.style("core:container", { width: "140px" })),
      3: bucket(b.style("core:container", { width: "140px" })),
      4: bucket(b.style("core:container", { width: "140px" })),
      5: bucket(b.style("core:heading", { fontSize: "24px", color: "#ffffff" })),
      6: bucket(b.style("core:text", { fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#94a3b8", fontWeight: "700" })),
      7: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "12px", color: "#ffffff" })),
      8: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "8px", color: "#ffffff" })),
      9: bucket(b.style("core:text", { fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#94a3b8", fontWeight: "700" })),
      10: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "12px", color: "#ffffff" })),
      11: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "8px", color: "#ffffff" })),
      12: bucket(b.style("core:text", { fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#94a3b8", fontWeight: "700" })),
      13: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "12px", color: "#ffffff" })),
      14: bucket(b.style("core:paragraph", { fontSize: "12px", marginTop: "8px", color: "#ffffff" })),
    },
  };
};

export const expandedPresetDefinitions: PresetDefinition[] = [
  createStaticSubtreePresetDefinition({
    id: "custom:announcementBar",
    label: "Announcement Bar",
    group: PRESET_GROUPS.components,
    order: 20,
    requires: ["core:row", "core:text", "core:button"],
    templateFactory: announcementBarTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:featureTile",
    label: "Feature Tile",
    group: PRESET_GROUPS.components,
    order: 21,
    requires: ["core:container", "core:text", "core:heading", "core:paragraph", "core:button"],
    templateFactory: featureTileTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:metricCard",
    label: "Metric Card",
    group: PRESET_GROUPS.components,
    order: 22,
    requires: ["core:container", "core:text", "core:heading", "core:paragraph"],
    templateFactory: metricCardTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:mediaCard",
    label: "Media Card",
    group: PRESET_GROUPS.components,
    order: 23,
    requires: ["core:container", "core:image", "core:heading", "core:paragraph", "core:button"],
    templateFactory: mediaCardTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:testimonialCard",
    label: "Testimonial Card",
    group: PRESET_GROUPS.components,
    order: 24,
    requires: ["core:container", "core:text", "core:paragraph"],
    templateFactory: testimonialCardTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:pricingCard",
    label: "Pricing Card",
    group: PRESET_GROUPS.components,
    order: 25,
    requires: ["core:container", "core:text", "core:heading", "core:list", "core:listItem", "core:button"],
    templateFactory: pricingCardTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:splitHero",
    label: "Split Hero",
    group: PRESET_GROUPS.sections,
    order: 30,
    requires: ["core:row", "core:container", "core:text", "core:heading", "core:button", "core:image"],
    templateFactory: splitHeroTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:ctaBanner",
    label: "CTA Banner",
    group: PRESET_GROUPS.sections,
    order: 31,
    requires: ["core:row", "core:heading", "core:paragraph", "core:button"],
    templateFactory: ctaBannerTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:logoCloud",
    label: "Logo Cloud",
    group: PRESET_GROUPS.sections,
    order: 32,
    requires: ["core:container", "core:row", "core:text"],
    templateFactory: logoCloudTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:statsBand",
    label: "Stats Band",
    group: PRESET_GROUPS.sections,
    order: 33,
    requires: ["core:row", "core:container", "core:text", "core:paragraph"],
    templateFactory: statsBandTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:featureGrid",
    label: "Feature Grid",
    group: PRESET_GROUPS.sections,
    order: 34,
    requires: ["core:container", "core:text", "core:heading", "core:paragraph"],
    templateFactory: featureGridTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:galleryRail",
    label: "Gallery Rail",
    group: PRESET_GROUPS.sections,
    order: 35,
    requires: ["core:row", "core:image"],
    templateFactory: galleryRailTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:faqSection",
    label: "FAQ Section",
    group: PRESET_GROUPS.sections,
    order: 36,
    requires: ["core:container", "core:heading", "core:text", "core:paragraph"],
    templateFactory: faqSectionTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:testimonialTrio",
    label: "Testimonial Trio",
    group: PRESET_GROUPS.sections,
    order: 37,
    requires: ["core:container", "core:heading", "core:text", "core:paragraph"],
    templateFactory: testimonialTrioTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:footerColumns",
    label: "Footer Columns",
    group: PRESET_GROUPS.sections,
    order: 38,
    requires: ["core:row", "core:container", "core:heading", "core:text", "core:paragraph"],
    templateFactory: footerColumnsTemplate,
  }),
];
