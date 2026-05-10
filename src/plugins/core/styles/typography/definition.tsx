import type { StyleSectionDefinition } from "@core/kernel/types";
import {
  TypographyCompositeField,
  TypographyFontFamilyComposite,
} from "@core/components/Cssbar/tabs/CssTab/styleInspector/fields";
import { isTextLikeNode } from "../shared/visibility";

export const typographySection: StyleSectionDefinition = {
  id: "typography",
  title: "Typography",
  visible: isTextLikeNode,
  fields: [
    {
      id: "typo-toolbar",
      type: "composite",
      render: (ctx) => <TypographyCompositeField ctx={ctx} />,
    },
    {
      id: "font-family",
      type: "composite",
      render: (ctx) => <TypographyFontFamilyComposite ctx={ctx} />,
    },
    {
      id: "font-size",
      type: "text",
      label: "Font-Size",
      prop: "fontSize",
      units: ["auto", "8px", "10px", "12px", "14px", "16px", "20px", "24px"],
    },
    {
      id: "font-weight",
      type: "text",
      label: "Font-Weight",
      prop: "fontWeight",
      units: [
        "auto",
        "bold",
        "bolder",
        "lighter",
        "100",
        "200",
        "300",
        "400",
        "500",
        "600",
      ],
    },
    {
      id: "text-transform",
      type: "text",
      label: "Transform",
      prop: "textTransform",
      units: ["none", "uppercase", "lowercase", "capitalize"],
      selectOnly: true,
      defaultValue: "none",
    },
    {
      id: "text-align",
      type: "text",
      label: "Alignment",
      prop: "textAlign",
      units: ["left", "right", "center", "justify"],
      selectOnly: true,
      defaultValue: "left",
    },
    {
      id: "word-spacing",
      type: "text",
      label: "Word-Spacing",
      prop: "wordSpacing",
      units: ["normal", "4px", "8px", "12px"],
      defaultValue: "normal",
    },
    {
      id: "letter-spacing",
      type: "text",
      label: "Letter-Spacing",
      prop: "letterSpacing",
      units: ["normal", "4px", "8px", "12px"],
      defaultValue: "normal",
    },
  ],
};
