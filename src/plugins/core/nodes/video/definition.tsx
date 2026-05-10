import { createElement } from "react";
import { GoVideo } from "react-icons/go";
import type { NodeTypeDefinition } from "@core/kernel/types";
import { MEDIA_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderVideoNode } from "../shared/renderers";

export const videoNodeDefinition: NodeTypeDefinition = {
  kind: "core:video",
  label: "Video",
  icon: () => createElement(GoVideo, { size: 30 }),
  isContainer: false,
  sidebar: { visible: true, group: "Elements", order: 7 },
  renderer: renderVideoNode,
  createRecord: () => ({
    name: "Video",
    type: "core:video",
    hyperlink: "",
    media: {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      loop: true,
      muted: true,
      autoPlay: true,
      controls: false,
    },
  }),
  createStyle: () => ({}),
  edit: defaultEdit([
    "name",
    "hyperlink",
    "media.src",
    "media.autoPlay",
    "media.controls",
    "media.loop",
    "media.muted",
  ]),
  styles: { sectionIds: [...MEDIA_STYLE_SECTION_IDS] },
  export: {
    tag: "video",
    getAttributes: (record) => ({
      src: record.type === "core:video" ? record.media.src : undefined,
      controls: record.type === "core:video" ? record.media.controls : undefined,
      loop: record.type === "core:video" ? record.media.loop : undefined,
      autoplay: record.type === "core:video" ? record.media.autoPlay : undefined,
      muted: record.type === "core:video" ? record.media.muted : undefined,
    }),
  },
};
