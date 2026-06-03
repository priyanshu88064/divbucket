import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FiStar } from "react-icons/fi";
import type { NodeTypeDefinition } from "@core/kernel/types";
import type { NodeRecord } from "@core/types/document";
import { BASE_NON_ROOT_STYLE_SECTION_IDS } from "../../styles";
import { defaultEdit } from "../shared/edit";
import { renderIconNode } from "../shared/renderers";
import { getCachedIconComponent } from "./catalog";
import { DEFAULT_ICON_PAYLOAD, coerceIconPayload } from "./payload";

const FALLBACK_ICON_MARKUP =
  '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" width="1em" height="1em" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

export const iconNodeDefinition: NodeTypeDefinition = {
  kind: "custom:icon",
  label: "Icon",
  icon: () => createElement(FiStar, { size: 24 }),
  isContainer: false,
  sidebar: { visible: false, group: "Elements", order: 11 },
  renderer: renderIconNode,
  createRecord: () =>
    ({
      name: "Icon",
      type: "custom:icon",
      hyperlink: "",
      payload: { ...DEFAULT_ICON_PAYLOAD },
    }) as NodeRecord,
  createStyle: () => ({
    width: "fit-content",
    height: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    lineHeight: "1",
    color: "#111827",
  }),
  edit: defaultEdit(["name", "hyperlink"]),
  styles: { sectionIds: [...BASE_NON_ROOT_STYLE_SECTION_IDS] },
  export: {
    tag: "span",
    getAttributes: (record) => {
      if (record.type !== "custom:icon") return {};
      const payload = coerceIconPayload(record);
      return {
        "data-icon-id": payload.iconId,
        "aria-hidden": "true",
      };
    },
    getInnerHtml: (record) => {
      if (record.type !== "custom:icon") return "";
      const payload = coerceIconPayload(record);
      const ResolvedIcon = getCachedIconComponent(payload.iconId);
      if (!ResolvedIcon) return FALLBACK_ICON_MARKUP;

      return renderToStaticMarkup(
        createElement(ResolvedIcon, {
          "aria-hidden": "true",
          focusable: "false",
        }),
      );
    },
  },
};
