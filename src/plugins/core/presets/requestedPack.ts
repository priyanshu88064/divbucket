import type { CSSProperties } from "react";
import type { PresetDefinition } from "@core/kernel/types";
import type { NodeRecord } from "@core/types/document";
import type { Template } from "@core/types/Template";
import type { PresetTemplateHelpers } from "./shared/templateHelpers";
import { createStaticSubtreePresetDefinition } from "./shared/createStaticSubtreePresetDefinition";
import { PRESET_GROUPS } from "./shared/groups";

const styleBucket = (defaultStyle: CSSProperties): Template["nodeStyleMap"][number] => ({
  default: defaultStyle,
  hover: {},
  active: {},
});

const createBlocks = ({ createRecord, createStyle }: PresetTemplateHelpers) => ({
  container: () => createRecord("core:container"),
  row: () => createRecord("core:row"),
  text: (content: string) => ({ ...createRecord("core:text"), content }),
  heading: (content: string) => ({ ...createRecord("core:heading"), content }),
  paragraph: (content: string) => ({ ...createRecord("core:paragraph"), content }),
  button: (content: string) => ({
    ...createRecord("core:button"),
    content,
    styleUi: { background: { mode: "Solid" as const } },
  }),
  image: (src: string, alt: string) => ({
    ...createRecord("core:image"),
    media: { src, alt },
  }),
  input: (placeholder: string, inputType: string) =>
    ({
      name: "Input",
      type: "custom:input",
      payload: {
        inputType,
        placeholder,
        value: "",
        name: "",
        required: false,
        disabled: false,
      },
    }) as NodeRecord,
  style: (kind: Parameters<typeof createStyle>[0], override: CSSProperties) => ({
    ...createStyle(kind),
    ...override,
  }),
});

const createVFlexTemplate = ({ createRecord, createStyle }: PresetTemplateHelpers): Template => {
  const b = createBlocks({ createRecord, createStyle });

  return {
    nodeChildrenMap: { 0: [1, 2], 1: [], 2: [] },
    nodeRecordMap: {
      0: { ...b.container(), name: "V-Flex" },
      1: { ...b.text("Vertical Stack"), name: "Heading Line" },
      2: { ...b.paragraph("A simple vertical flex starter block."), name: "Helper Line" },
    },
    nodeStyleMap: {
      0: styleBucket(
        b.style("core:container", {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          minHeight: "20px",
          paddingTop: "12px",
          paddingRight: "12px",
          paddingBottom: "12px",
          paddingLeft: "12px",
          borderWidth: "1px",
          borderStyle: "dashed",
          borderColor: "#cbd5e1",
          borderRadius: "10px",
        }),
      ),
      1: styleBucket(
        b.style("core:text", {
          fontSize: "14px",
          fontWeight: "700",
          color: "#0f172a",
        }),
      ),
      2: styleBucket(
        b.style("core:paragraph", {
          fontSize: "12px",
          color: "#475569",
        }),
      ),
    },
  };
};

const createBadgeTemplate = ({ createRecord, createStyle }: PresetTemplateHelpers): Template => {
  const b = createBlocks({ createRecord, createStyle });

  return {
    nodeChildrenMap: { 0: [] },
    nodeRecordMap: {
      0: { ...b.text("NEW"), name: "Badge", styleUi: { background: { mode: "Solid" as const } } },
    },
    nodeStyleMap: {
      0: styleBucket(
        b.style("core:text", {
          width: "fit-content",
          paddingTop: "4px",
          paddingRight: "10px",
          paddingBottom: "4px",
          paddingLeft: "10px",
          fontSize: "10px",
          fontWeight: "700",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#ffffff",
          backgroundColor: "#0f766e",
          borderRadius: "999px",
        }),
      ),
    },
  };
};

const createAvatarTemplate = ({ createRecord, createStyle }: PresetTemplateHelpers): Template => {
  const b = createBlocks({ createRecord, createStyle });

  return {
    nodeChildrenMap: { 0: [] },
    nodeRecordMap: {
      0: {
        ...b.image("https://picsum.photos/id/1005/200/200", "Avatar"),
        name: "Avatar",
      },
    },
    nodeStyleMap: {
      0: styleBucket(
        b.style("core:image", {
          width: "72px",
          height: "72px",
          objectFit: "cover",
          borderRadius: "50%",
          borderWidth: "2px",
          borderStyle: "solid",
          borderColor: "#e2e8f0",
        }),
      ),
    },
  };
};

const createContactFormTemplate = ({
  createRecord,
  createStyle,
}: PresetTemplateHelpers): Template => {
  const b = createBlocks({ createRecord, createStyle });

  return {
    nodeChildrenMap: { 0: [1, 2, 3, 4, 5, 6], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
    nodeRecordMap: {
      0: { ...b.container(), name: "Contact Form", styleUi: { background: { mode: "Solid" as const } } },
      1: { ...b.heading("Contact Us"), name: "Form Heading" },
      2: { ...b.paragraph("Drop us a message and we will reply quickly."), name: "Form Copy" },
      3: { ...b.input("Your Name", "text"), name: "Name Input" },
      4: { ...b.input("Email Address", "email"), name: "Email Input" },
      5: { ...b.input("Message", "text"), name: "Message Input" },
      6: { ...b.button("Send Message"), name: "Submit Button" },
    },
    nodeStyleMap: {
      0: styleBucket(
        b.style("core:container", {
          width: "100%",
          maxWidth: "480px",
          paddingTop: "24px",
          paddingRight: "24px",
          paddingBottom: "24px",
          paddingLeft: "24px",
          backgroundColor: "#f8fafc",
          borderRadius: "24px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e2e8f0",
        }),
      ),
      1: styleBucket(
        b.style("core:heading", {
          fontSize: "28px",
          color: "#0f172a",
          fontWeight: "bolder",
        }),
      ),
      2: styleBucket(
        b.style("core:paragraph", {
          fontSize: "12px",
          color: "#475569",
          marginTop: "10px",
          marginBottom: "18px",
        }),
      ),
      3: styleBucket(
        b.style("custom:input", {
          width: "100%",
          marginTop: "10px",
        }),
      ),
      4: styleBucket(
        b.style("custom:input", {
          width: "100%",
          marginTop: "10px",
        }),
      ),
      5: styleBucket(
        b.style("custom:input", {
          width: "100%",
          height: "52px",
          marginTop: "10px",
        }),
      ),
      6: styleBucket(
        b.style("core:button", {
          width: "100%",
          marginTop: "14px",
          paddingTop: "10px",
          paddingBottom: "10px",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "600",
        }),
      ),
    },
  };
};

const createBentoGridTemplate = ({
  createRecord,
  createStyle,
}: PresetTemplateHelpers): Template => {
  const b = createBlocks({ createRecord, createStyle });

  return {
    nodeChildrenMap: {
      0: [1, 2, 3, 4],
      1: [5, 6],
      2: [7, 8],
      3: [9],
      4: [10],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
      10: [],
    },
    nodeRecordMap: {
      0: { ...b.row(), name: "Bento Grid" },
      1: { ...b.container(), name: "Bento Large", styleUi: { background: { mode: "Solid" as const } } },
      2: { ...b.container(), name: "Bento Medium", styleUi: { background: { mode: "Solid" as const } } },
      3: { ...b.container(), name: "Bento Small A", styleUi: { background: { mode: "Solid" as const } } },
      4: { ...b.container(), name: "Bento Small B", styleUi: { background: { mode: "Solid" as const } } },
      5: { ...b.heading("Bento Grid"), name: "Bento Title" },
      6: { ...b.paragraph("Use this as a modular layout for features, metrics, or media callouts."), name: "Bento Copy" },
      7: { ...b.image("https://picsum.photos/id/1040/640/480", "Bento visual"), name: "Bento Image" },
      8: { ...b.text("Media block"), name: "Bento Media Label" },
      9: { ...b.text("Stat tile"), name: "Bento Stat" },
      10: { ...b.text("CTA tile"), name: "Bento CTA" },
    },
    nodeStyleMap: {
      0: styleBucket(
        b.style("core:row", {
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          gap: "14px",
        }),
      ),
      1: styleBucket(
        b.style("core:container", {
          width: "58%",
          minWidth: "260px",
          minHeight: "180px",
          paddingTop: "22px",
          paddingRight: "22px",
          paddingBottom: "22px",
          paddingLeft: "22px",
          backgroundColor: "#fef3c7",
          borderRadius: "22px",
        }),
      ),
      2: styleBucket(
        b.style("core:container", {
          width: "40%",
          minWidth: "220px",
          minHeight: "180px",
          paddingTop: "14px",
          paddingRight: "14px",
          paddingBottom: "14px",
          paddingLeft: "14px",
          backgroundColor: "#dbeafe",
          borderRadius: "22px",
        }),
      ),
      3: styleBucket(
        b.style("core:container", {
          width: "40%",
          minWidth: "220px",
          minHeight: "110px",
          paddingTop: "18px",
          paddingRight: "18px",
          paddingBottom: "18px",
          paddingLeft: "18px",
          backgroundColor: "#dcfce7",
          borderRadius: "22px",
        }),
      ),
      4: styleBucket(
        b.style("core:container", {
          width: "58%",
          minWidth: "260px",
          minHeight: "110px",
          paddingTop: "18px",
          paddingRight: "18px",
          paddingBottom: "18px",
          paddingLeft: "18px",
          backgroundColor: "#fde2e8",
          borderRadius: "22px",
        }),
      ),
      5: styleBucket(
        b.style("core:heading", {
          fontSize: "30px",
          color: "#0f172a",
          fontWeight: "bolder",
        }),
      ),
      6: styleBucket(
        b.style("core:paragraph", {
          fontSize: "12px",
          color: "#475569",
          marginTop: "12px",
          maxWidth: "300px",
        }),
      ),
      7: styleBucket(
        b.style("core:image", {
          width: "100%",
          height: "120px",
          objectFit: "cover",
          borderRadius: "14px",
        }),
      ),
      8: styleBucket(
        b.style("core:text", {
          fontSize: "12px",
          marginTop: "10px",
          color: "#0f172a",
          fontWeight: "600",
        }),
      ),
      9: styleBucket(
        b.style("core:text", {
          fontSize: "20px",
          color: "#166534",
          fontWeight: "700",
        }),
      ),
      10: styleBucket(
        b.style("core:text", {
          fontSize: "20px",
          color: "#be123c",
          fontWeight: "700",
        }),
      ),
    },
  };
};

export const requestedPackPresetDefinitions: PresetDefinition[] = [
  createStaticSubtreePresetDefinition({
    id: "custom:vFlex",
    label: "V-Flex",
    group: PRESET_GROUPS.components,
    order: 50,
    requires: ["core:container", "core:text", "core:paragraph"],
    templateFactory: createVFlexTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:badge",
    label: "Badge",
    group: PRESET_GROUPS.components,
    order: 51,
    requires: ["core:text"],
    templateFactory: createBadgeTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:avatar",
    label: "Avatar",
    group: PRESET_GROUPS.components,
    order: 52,
    requires: ["core:image"],
    templateFactory: createAvatarTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:contactForm",
    label: "Contact Form",
    group: PRESET_GROUPS.sections,
    order: 53,
    requires: ["core:container", "core:heading", "core:paragraph", "custom:input", "core:button"],
    templateFactory: createContactFormTemplate,
  }),
  createStaticSubtreePresetDefinition({
    id: "custom:bentoGrid",
    label: "Bento Grid",
    group: PRESET_GROUPS.sections,
    order: 54,
    requires: ["core:row", "core:container", "core:heading", "core:paragraph", "core:text", "core:image"],
    templateFactory: createBentoGridTemplate,
  }),
];
