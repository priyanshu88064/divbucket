import type { CSSProperties } from "react";
import type {
  BackgroundType,
  NodeStyleUi,
  SpacingLinkMode,
} from "@core/types/document";
import type {
  BackgroundModeValue,
  ShadowValue,
  SpacingAxisValue,
  TransformValue,
} from "./types";

const BOX_SHADOW_LEVEL_MAP: Record<string, string> = {
  none: "0 0",
  "Extra-small": "0 1px 3px",
  Small: "0 1px 6px",
  Medium: "0 3px 6px",
  Large: "0 10px 15px",
  "Extra-large": "0 25px 50px",
};

const TEXT_SHADOW_LEVEL_MAP: Record<string, string> = {
  none: "none",
  "Extra-small": "1px 1px 1px",
  Small: "2px 2px 1px",
  Medium: "3px 3px 2px",
  Large: "4px 5px 2px",
  "Extra-large": "5px 6px 3px",
};

const boxShadowLevelFromCss = (value?: string): string => {
  if (!value || value.includes("0 0")) return "none";
  for (const [level, prefix] of Object.entries(BOX_SHADOW_LEVEL_MAP)) {
    if (value.includes(prefix) && level !== "none") return level;
  }
  return "Extra-large";
};

const textShadowLevelFromCss = (value?: string): string => {
  if (!value || value.includes("none")) return "none";
  for (const [level, prefix] of Object.entries(TEXT_SHADOW_LEVEL_MAP)) {
    if (value.includes(prefix) && level !== "none") return level;
  }
  return "Extra-large";
};

const shadowColorFromCss = (value?: string): string => {
  if (!value || !value.includes("#")) return "#000000";
  return `#${value.split("#")[1]}`;
};

const replaceShadowColor = (value: string, color: string): string => {
  if (!value.includes("#")) return `${value} ${color}`;
  return `${value.split("#")[0]}${color}`;
};

export const shadowAdapter = {
  parseBoxShadow(style: CSSProperties): ShadowValue {
    const value = style.boxShadow as string | undefined;
    return {
      level: boxShadowLevelFromCss(value),
      color: shadowColorFromCss(value),
    };
  },
  formatBoxShadow(value: ShadowValue): string {
    const prefix =
      BOX_SHADOW_LEVEL_MAP[value.level] || BOX_SHADOW_LEVEL_MAP["none"];
    return `${prefix} ${value.color || "#000000"}`;
  },
  parseTextShadow(style: CSSProperties): ShadowValue {
    const value = style.textShadow as string | undefined;
    return {
      level: textShadowLevelFromCss(value),
      color: shadowColorFromCss(value),
    };
  },
  formatTextShadow(value: ShadowValue): string {
    if (value.level === "none") return "none";
    const prefix =
      TEXT_SHADOW_LEVEL_MAP[value.level] || TEXT_SHADOW_LEVEL_MAP["none"];
    return `${prefix} ${value.color || "#000000"}`;
  },
  updateColor(styleValue: string | undefined, color: string): string {
    if (!styleValue) return color;
    return replaceShadowColor(styleValue, color);
  },
};

export const transformAdapter = {
  parse(style: CSSProperties): TransformValue {
    const translateParts = ((style.translate as string) || "0 0").split(" ");
    const scaleParts = ((style.scale as string) || "1 1").split(" ");
    return {
      translateX: translateParts[0] || "0",
      translateY: translateParts[1] || "0",
      scaleX: scaleParts[0] || "1",
      scaleY: scaleParts[1] || "1",
      rotate: (style.rotate as string) || "0",
    };
  },
  format(value: TransformValue): CSSProperties {
    return {
      translate: `${value.translateX} ${value.translateY}`,
      scale: `${value.scaleX} ${value.scaleY}`,
      rotate: value.rotate,
    };
  },
};

export const backgroundAdapter = {
  parse(
    styleUi: NodeStyleUi | undefined,
    style?: CSSProperties,
  ): BackgroundModeValue {
    if (styleUi?.background?.mode) {
      return { mode: styleUi.background.mode };
    }
    if (style?.backgroundImage) return { mode: "URL" };
    if (style?.backgroundColor) return { mode: "Solid" };
    if (style?.background) return { mode: "Custom" };
    return { mode: "Auto" };
  },
  format(mode: BackgroundType, style: CSSProperties): CSSProperties {
    const next = { ...style };
    switch (mode) {
      case "Auto":
        next.background = "transparent";
        delete next.backgroundColor;
        delete next.backgroundImage;
        delete next.backgroundRepeat;
        delete next.backgroundPosition;
        delete next.backgroundSize;
        break;
      case "Solid":
        next.backgroundColor = (next.backgroundColor as string) || "#ffffff";
        delete next.background;
        delete next.backgroundImage;
        delete next.backgroundRepeat;
        delete next.backgroundPosition;
        delete next.backgroundSize;
        break;
      case "URL":
        next.backgroundImage =
          (next.backgroundImage as string) ||
          "url(https://picsum.photos/200/300)";
        next.backgroundRepeat =
          (next.backgroundRepeat as string) || "no-repeat";
        next.backgroundPosition =
          (next.backgroundPosition as string) || "left top";
        next.backgroundSize = (next.backgroundSize as string) || "auto";
        next.backgroundColor = (next.backgroundColor as string) || "#ffffff";
        delete next.background;
        break;
      case "Custom":
        next.background = (next.background as string) || "transparent";
        delete next.backgroundColor;
        delete next.backgroundImage;
        delete next.backgroundRepeat;
        delete next.backgroundPosition;
        delete next.backgroundSize;
        break;
    }
    return next;
  },
  setMode(styleUi: NodeStyleUi | undefined, mode: BackgroundType): NodeStyleUi {
    return {
      ...styleUi,
      background: { mode },
    };
  },
};

const spacingUiPath = (prefix: "margin" | "padding") =>
  prefix === "margin" ? "margin" : "padding";

const linkModeFromUi = (
  styleUi: NodeStyleUi | undefined,
  prefix: "margin" | "padding",
) => styleUi?.spacing?.[spacingUiPath(prefix)]?.linkMode || "none";

const mergeStyleUi = (
  styleUi: NodeStyleUi | undefined,
  next: NodeStyleUi,
): NodeStyleUi => ({
  ...styleUi,
  ...next,
  spacing: {
    ...styleUi?.spacing,
    ...next.spacing,
  },
});

export const spacingAdapter = {
  parse(
    styleUi: NodeStyleUi | undefined,
    prefix: "margin" | "padding",
  ): SpacingAxisValue {
    return { linkMode: linkModeFromUi(styleUi, prefix) };
  },
  setLinkMode(
    styleUi: NodeStyleUi | undefined,
    prefix: "margin" | "padding",
    linkMode: SpacingLinkMode,
  ): NodeStyleUi {
    return mergeStyleUi(styleUi, {
      spacing: {
        [spacingUiPath(prefix)]: {
          linkMode,
        },
      },
    });
  },
  updateDirectionalValue({
    style,
    prefix,
    dir,
    value,
    linkMode,
  }: {
    style: CSSProperties;
    prefix: "margin" | "padding";
    dir: "Top" | "Right" | "Bottom" | "Left";
    value: string;
    linkMode: SpacingLinkMode;
  }): CSSProperties {
    const next: CSSProperties = {
      ...style,
      [`${prefix}${dir}`]: value,
    };

    if (linkMode === "all") {
      next[`${prefix}Top`] = value;
      next[`${prefix}Right`] = value;
      next[`${prefix}Bottom`] = value;
      next[`${prefix}Left`] = value;
      return next;
    }
    if (linkMode === "x" && (dir === "Left" || dir === "Right")) {
      next[`${prefix}Left`] = value;
      next[`${prefix}Right`] = value;
    }
    if (linkMode === "y" && (dir === "Top" || dir === "Bottom")) {
      next[`${prefix}Top`] = value;
      next[`${prefix}Bottom`] = value;
    }
    return next;
  },
};
