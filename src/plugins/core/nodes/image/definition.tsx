import { createElement } from "react";
import { PiImageLight } from "react-icons/pi";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { MEDIA_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderImageNode } from "../shared/renderers";

export const imageNodeDefinition: NodeTypeDefinition = {
  kind: "core:image",
  label: "Image",
  icon: () => createElement(PiImageLight, { size: 30 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 6 },
  renderer: renderImageNode,
  createRecord: () => ({
    name: "Image",
    type: "core:image",
    hyperlink: "",
    media: { src: "/sample.jpg", alt: "Image" },
  }),
  createStyle: () => ({ width: "fit-content", height: "fit-content" }),
  edit: defaultEdit(["name", "hyperlink", "media.src", "media.alt"]),
  styles: { sectionIds: [...MEDIA_STYLE_SECTION_IDS] },
  export: {
    tag: "img",
    selfClosing: true,
    getAttributes: (record) => ({
      src: record.type === "core:image" ? record.media.src : undefined,
      alt: record.type === "core:image" ? record.media.alt : undefined,
    }),
  },
};
