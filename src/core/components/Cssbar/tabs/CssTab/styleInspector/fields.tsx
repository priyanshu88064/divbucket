import TextInput from "@core/utils/inputs/TextInput/TextInput";
import Select from "@core/utils/inputs/Select/Select";
import Colorpicker from "@core/utils/inputs/Colorpicker/Colorpicker";
import CheckBox from "@core/utils/inputs/CheckBox/CheckBox";
import styles from "../../../cssbar.module.css";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { AiOutlineFontSize } from "react-icons/ai";
import {
  backgroundAdapter,
  shadowAdapter,
  spacingAdapter,
  transformAdapter,
} from "./adapters";
import type { StyleInspectorContext } from "./types";

const BG_OPTIONS = ["Auto", "Solid", "URL", "Custom"] as const;
const BORDER_STYLES = new Set([
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
]);

const parseBorderShorthand = (value?: string) => {
  if (!value) {
    return {
      width: undefined,
      style: undefined,
      color: undefined,
    };
  }

  const parts = value.trim().split(/\s+/);
  const styleIndex = parts.findIndex((part) =>
    BORDER_STYLES.has(part.toLowerCase()),
  );

  if (styleIndex === -1) {
    return {
      width: undefined,
      style: undefined,
      color: undefined,
    };
  }

  const width = parts.slice(0, styleIndex).join(" ") || undefined;
  const style = parts[styleIndex] || undefined;
  const color = parts.slice(styleIndex + 1).join(" ") || undefined;

  return { width, style, color };
};

const resolveBorderParts = (style: StyleInspectorContext["style"]) => {
  const parsed = parseBorderShorthand(style.border as string | undefined);
  return {
    width: (style.borderWidth as string | undefined) || parsed.width,
    style: (style.borderStyle as string | undefined) || parsed.style,
    color: (style.borderColor as string | undefined) || parsed.color,
  };
};

const toSpacingPair = (value?: string, fallback = "0"): [string, string] => {
  const [first, second] = (value || `${fallback} ${fallback}`).split(" ");
  return [first || fallback, second || fallback];
};

const updateTextDecoration = (
  ctx: StyleInspectorContext,
  value: "underline" | "line-through",
) => {
  if (ctx.style.textDecoration === value) {
    const next = { ...ctx.style };
    delete next.textDecoration;
    ctx.setStyle(next);
    return;
  }
  ctx.patchStyle({ textDecoration: value });
};

export const FlexCompositeField = ({ ctx }: { ctx: StyleInspectorContext }) => {
  if (ctx.style.display !== "flex") return null;
  return (
    <>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Direction</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={(ctx.style.flexDirection as string) || "auto"}
            units={["auto", "row", "row-reverse", "column", "column-reverse"]}
            onChange={(value) => ctx.patchStyle({ flexDirection: value })}
            isSelectOnly={true}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Justify</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={(ctx.style.justifyContent as string) || "auto"}
            units={[
              "auto",
              "flex-start",
              "flex-end",
              "center",
              "space-around",
              "space-between",
              "space-evenly",
            ]}
            onChange={(value) => ctx.patchStyle({ justifyContent: value })}
            isSelectOnly={true}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Align</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={(ctx.style.alignItems as string) || "auto"}
            units={[
              "auto",
              "stretch",
              "center",
              "flex-start",
              "flex-end",
              "start",
              "end",
              "baseline",
            ]}
            onChange={(value) => ctx.patchStyle({ alignItems: value })}
            isSelectOnly={true}
          />
        </div>
      </div>
      <div className={styles.dic2}>
        <div className={styles.dic20}>
          <div className={styles.inputLabelInline}>
            Gap
          </div>
          <div className={styles.flexGapInput}>
            <TextInput
              value={(ctx.style.gap as string) || "auto"}
              onChange={(value) => ctx.patchStyle({ gap: value })}
            />
          </div>
        </div>
        <div className={styles.flexWrapControl}>
          <CheckBox
            name={"flex-wrap"}
            checked={ctx.style.flexWrap === "wrap"}
            onChange={(e) =>
              ctx.patchStyle({ flexWrap: e.target.checked ? "wrap" : "nowrap" })
            }
          />
        </div>
      </div>
    </>
  );
};

export const SpacingCompositeField = ({
  ctx,
  prefix,
}: {
  ctx: StyleInspectorContext;
  prefix: "margin" | "padding";
}) => {
  const linkMode = spacingAdapter.parse(ctx.styleUi, prefix).linkMode;
  const getValue = (dir: "Top" | "Right" | "Bottom" | "Left") =>
    ((ctx.style as Record<string, string | undefined>)[
      `${prefix}${dir}`
    ] as string) || "0";

  const setDir = (dir: "Top" | "Right" | "Bottom" | "Left", value: string) => {
    ctx.setStyle(
      spacingAdapter.updateDirectionalValue({
        style: ctx.style,
        prefix,
        dir,
        value,
        linkMode,
      }),
    );
  };

  const setLinkMode = (nextMode: "none" | "x" | "y" | "all") => {
    ctx.setStyleUi(spacingAdapter.setLinkMode(ctx.styleUi, prefix, nextMode));
    if (nextMode === "all") {
      const base = getValue("Top");
      ctx.setStyle(
        spacingAdapter.updateDirectionalValue({
          style: ctx.style,
          prefix,
          dir: "Top",
          value: base,
          linkMode: "all",
        }),
      );
    }
  };

  return (
    <div className={`${styles.padwrap} ${styles.bgwrap}`}>
      {(["Top", "Right", "Bottom", "Left"] as const).map((dir) => (
        <div className={styles.bg0} key={`${prefix}-${dir}`}>
          <div className={styles.bg0name}>{dir}</div>
          <div className={styles.sizesiwrap}>
            <TextInput
              value={getValue(dir)}
              onChange={(value) => setDir(dir, value)}
            />
          </div>
        </div>
      ))}
      <div className={styles.axisLinkRow}>
        <CheckBox
          name="Link X"
          checked={linkMode === "x" || linkMode === "all"}
          onChange={(e) =>
            setLinkMode(
              normalizeSpacingModeToggles({
                current: linkMode,
                axis: "x",
                checked: e.target.checked,
              }),
            )
          }
        />
        <CheckBox
          name="Link Y"
          checked={linkMode === "y" || linkMode === "all"}
          onChange={(e) =>
            setLinkMode(
              normalizeSpacingModeToggles({
                current: linkMode,
                axis: "y",
                checked: e.target.checked,
              }),
            )
          }
        />
        <CheckBox
          name="Link All"
          checked={linkMode === "all"}
          onChange={(e) => setLinkMode(e.target.checked ? "all" : "none")}
        />
      </div>
    </div>
  );
};

export const BackgroundCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const mode = backgroundAdapter.parse(ctx.styleUi, ctx.style).mode;
  return (
    <>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Background</div>
        <div className={styles.bg01}>
          <Select
            options={[...BG_OPTIONS]}
            values={[...BG_OPTIONS]}
            value={mode}
            onChange={(value) => {
              const nextMode = value as (typeof BG_OPTIONS)[number];
              ctx.setStyle(backgroundAdapter.format(nextMode, ctx.style));
              ctx.setStyleUi(backgroundAdapter.setMode(ctx.styleUi, nextMode));
            }}
          />
          {mode === "Solid" && (
            <Colorpicker
              value={(ctx.style.backgroundColor as string) || "#ffffff"}
              onChange={(value) => ctx.patchStyle({ backgroundColor: value })}
            />
          )}
        </div>
      </div>
      {mode === "URL" && (
        <>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>URL</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={
                  ((ctx.style.backgroundImage as string) || "url()")
                    .split("url(")[1]
                    ?.split(")")[0] || ""
                }
                onChange={(value) =>
                  ctx.patchStyle({ backgroundImage: `url(${value})` })
                }
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Repeat</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(ctx.style.backgroundRepeat as string) || "no-repeat"}
                units={[
                  "no-repeat",
                  "repeat",
                  "repeat-x",
                  "repeat-y",
                  "space",
                  "round",
                ]}
                onChange={(value) =>
                  ctx.patchStyle({ backgroundRepeat: value })
                }
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Position</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(ctx.style.backgroundPosition as string) || "left top"}
                units={[
                  "center",
                  "left",
                  "left top",
                  "left bottom",
                  "top",
                  "top left",
                  "top right",
                  "right",
                  "right top",
                  "right bottom",
                  "bottom",
                  "bottom left",
                  "bottom right",
                ]}
                onChange={(value) =>
                  ctx.patchStyle({ backgroundPosition: value })
                }
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Size</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(ctx.style.backgroundSize as string) || "auto"}
                units={["auto", "cover", "contain"]}
                onChange={(value) => ctx.patchStyle({ backgroundSize: value })}
                isSelectOnly={true}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Color</div>
            <div className={styles.sizesiwrap}>
              <Colorpicker
                value={(ctx.style.backgroundColor as string) || "#ffffff"}
                onChange={(value) => ctx.patchStyle({ backgroundColor: value })}
              />
            </div>
          </div>
        </>
      )}
      {mode === "Custom" && (
        <div className={styles.bg0}>
          <div className={styles.bg0name}>Value</div>
          <div className={styles.sizesiwrap}>
            <TextInput
              value={(ctx.style.background as string) || "transparent"}
              onChange={(value) => ctx.patchStyle({ background: value })}
            />
          </div>
        </div>
      )}
    </>
  );
};

export const TypographyCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className={`${styles.holder}`}>
        <div
          title="bold"
          className={`${styles.holder0} ${ctx.style.fontWeight === "bold" ? styles.holderactive : ""}`}
          onClick={() =>
            ctx.patchStyle({
              fontWeight: ctx.style.fontWeight === "bold" ? "auto" : "bold",
            })
          }
        >
          <FaBold />
        </div>
        <div
          title="italic"
          className={`${styles.holder0} ${ctx.style.fontStyle === "italic" ? styles.holderactive : ""}`}
          onClick={() =>
            ctx.patchStyle({
              fontStyle: ctx.style.fontStyle === "italic" ? "auto" : "italic",
            })
          }
        >
          <FaItalic />
        </div>
        <div
          title="underline"
          className={`${styles.holder0} ${ctx.style.textDecoration === "underline" ? styles.holderactive : ""}`}
          onClick={() => updateTextDecoration(ctx, "underline")}
        >
          <FaUnderline />
        </div>
        <div
          title="strikethrough"
          className={`${styles.holder0} ${ctx.style.textDecoration === "line-through" ? styles.holderactive : ""}`}
          onClick={() => updateTextDecoration(ctx, "line-through")}
        >
          <FaStrikethrough />
        </div>
        <div
          title="small-caps"
          className={`${styles.holder0} ${ctx.style.fontVariant === "small-caps" ? styles.holderactive : ""}`}
          onClick={() =>
            ctx.patchStyle({
              fontVariant:
                ctx.style.fontVariant === "small-caps" ? "auto" : "small-caps",
            })
          }
        >
          <AiOutlineFontSize size={15} color="var(--text_0)" />
        </div>
      </div>
      <Colorpicker
        value={(ctx.style.color as string) || "#000000"}
        onChange={(value) => ctx.patchStyle({ color: value })}
      />
    </div>
  );
};

export const BoxShadowCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const shadow = shadowAdapter.parseBoxShadow(ctx.style);
  return (
    <div className={styles.bg0}>
      <div className={styles.bg0name}>Box-Shadow</div>
      <div className="w-[100px] rounded-[5px] flex flex-col items-end gap-2">
        <TextInput
          value={shadow.level}
          units={[
            "none",
            "Extra-small",
            "Small",
            "Medium",
            "Large",
            "Extra-large",
          ]}
          onChange={(level) => {
            ctx.patchStyle({
              boxShadow: shadowAdapter.formatBoxShadow({
                level,
                color: shadow.color,
              }),
            });
          }}
          isSelectOnly={true}
        />
        <Colorpicker
          value={shadow.color}
          onChange={(color) => {
            const current = ctx.style.boxShadow as string | undefined;
            ctx.patchStyle({
              boxShadow: shadowAdapter.updateColor(current, color),
            });
          }}
        />
      </div>
    </div>
  );
};

export const TextShadowCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const shadow = shadowAdapter.parseTextShadow(ctx.style);
  return (
    <div className={styles.bg0}>
      <div className={styles.bg0name}>Text-Shadow</div>
      <div className="w-[100px] rounded-[5px] flex flex-col items-end gap-2">
        <TextInput
          value={shadow.level}
          units={[
            "none",
            "Extra-small",
            "Small",
            "Medium",
            "Large",
            "Extra-large",
          ]}
          onChange={(level) => {
            ctx.patchStyle({
              textShadow: shadowAdapter.formatTextShadow({
                level,
                color: shadow.color,
              }),
            });
          }}
          isSelectOnly={true}
        />
        <Colorpicker
          value={shadow.color}
          onChange={(color) => {
            if ((ctx.style.textShadow as string | undefined)?.includes("#")) {
              ctx.patchStyle({
                textShadow: shadowAdapter.updateColor(
                  ctx.style.textShadow as string,
                  color,
                ),
              });
              return;
            }
            if ((ctx.style.textShadow as string | undefined) === "none") return;
            ctx.patchStyle({ textShadow: `1px 1px 1px ${color}` });
          }}
        />
      </div>
    </div>
  );
};

export const TransformCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const parsed = transformAdapter.parse(ctx.style);
  const update = (patch: Partial<typeof parsed>) => {
    ctx.setStyle({
      ...ctx.style,
      ...transformAdapter.format({ ...parsed, ...patch }),
    });
  };

  return (
    <>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Translate-X</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={parsed.translateX}
            units={["0", "2px", "4px", "50%", "100%"]}
            onChange={(value) => update({ translateX: value })}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Translate-Y</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={parsed.translateY}
            units={["0", "2px", "4px", "50%", "100%"]}
            onChange={(value) => update({ translateY: value })}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Scale-X</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={parsed.scaleX}
            onChange={(value) => update({ scaleX: value })}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Scale-Y</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={parsed.scaleY}
            onChange={(value) => update({ scaleY: value })}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Rotate</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={parsed.rotate}
            units={["0deg", "45deg", "90deg", "180deg"]}
            onChange={(value) => update({ rotate: value })}
          />
        </div>
      </div>
    </>
  );
};

export const BorderWidthCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const border = resolveBorderParts(ctx.style);
  return (
    <>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Border-Width</div>
        <div className="ml-auto w-[100px] flex items-center gap-1 rounded-[5px]">
          <TextInput
            value={border.width || "0"}
            units={["0", "1px", "2px", "3px", "4px"]}
            onChange={(value) => ctx.patchStyle({ borderWidth: value })}
          />
          <Colorpicker
            value={border.color || "#000000"}
            onChange={(value) => ctx.patchStyle({ borderColor: value })}
          />
        </div>
      </div>
      {(["Top", "Bottom", "Right", "Left"] as const).map((dir) => (
        <div
          className={`${styles.bg0} relative ml-4 pl-4`}
          key={`border-${dir}`}
        >
          <div className="absolute left-0 w-3 top-[50%] border-b border-gray-600"></div>
          <div className={styles.bg0name}>{dir}</div>
          <div className={`${styles.sizesiwrap} !w-16`}>
            <TextInput
              value={
                ((ctx.style as Record<string, string | undefined>)[
                  `border${dir}Width`
                ] as string) || "0"
              }
              units={["0", "1px", "2px", "3px", "4px"]}
              onChange={(value) =>
                ctx.patchStyle({ [`border${dir}Width`]: value })
              }
            />
          </div>
        </div>
      ))}
    </>
  );
};

export const BorderStyleField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const border = resolveBorderParts(ctx.style);
  return (
    <div className={styles.bg0}>
      <div className={styles.bg0name}>Border-Style</div>
      <div className={styles.sizesiwrap}>
        <TextInput
          value={border.style || "none"}
          units={["none", "solid", "dotted", "dashed", "double", "groove"]}
          onChange={(next) => ctx.patchStyle({ borderStyle: next })}
          isSelectOnly={true}
        />
      </div>
    </div>
  );
};

export const PositionCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => {
  const position = (ctx.style.position as string) || "static";
  if (position === "static") return null;
  return (
    <>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Top</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={(ctx.style.top as string) || "auto"}
            onChange={(value) => ctx.patchStyle({ top: value })}
          />
        </div>
      </div>
      {position !== "fixed" && (
        <>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Right</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(ctx.style.right as string) || "auto"}
                onChange={(value) => ctx.patchStyle({ right: value })}
              />
            </div>
          </div>
          <div className={styles.bg0}>
            <div className={styles.bg0name}>Bottom</div>
            <div className={styles.sizesiwrap}>
              <TextInput
                value={(ctx.style.bottom as string) || "auto"}
                onChange={(value) => ctx.patchStyle({ bottom: value })}
              />
            </div>
          </div>
        </>
      )}
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Left</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={(ctx.style.left as string) || "auto"}
            onChange={(value) => ctx.patchStyle({ left: value })}
          />
        </div>
      </div>
      <div className={styles.bg0}>
        <div className={styles.bg0name}>Z-Index</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={(ctx.style.zIndex as string) || "auto"}
            onChange={(value) => ctx.patchStyle({ zIndex: value })}
          />
        </div>
      </div>
    </>
  );
};

export const TransitionCompositeField = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => (
  <CheckBox
    name={"Enable Transition"}
    checked={ctx.style.transition != null}
    onChange={(e) =>
      ctx.patchStyle({ transition: e.target.checked ? "all 200ms" : "auto" })
    }
  />
);

export const TypographyFontFamilyComposite = ({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) => (
  <div className={styles.bg0}>
    <div className={styles.bg0name}>Family</div>
    <div className={styles.fontselect}>
      <input
        type="text"
        className={`${styles.fontsi} ${!ctx.style.fontFamily ? styles.fontdefault : ""}`}
        value={(ctx.style.fontFamily as string) || "auto"}
        readOnly
      />
      <div className={styles.fontdrop}>
        {[
          "auto",
          "serif",
          "sans-serif",
          "monospace",
          "cursive",
          "fantasy",
          "system-ui",
          "ui-serif",
          "ui-sans-serif",
          "ui-monospace",
          "ui-rounded",
          "emoji",
          "math",
          "fangsong",
        ].map((font) => (
          <div
            key={font}
            style={{ fontFamily: font !== "auto" ? font : "" }}
            onMouseDown={() => ctx.patchStyle({ fontFamily: font })}
          >
            {font}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const normalizeSpacingModeToggles = ({
  current,
  axis,
  checked,
}: {
  current: "none" | "x" | "y" | "all";
  axis: "x" | "y";
  checked: boolean;
}): "none" | "x" | "y" | "all" => {
  if (checked) {
    if (current === "all") return "all";
    if ((axis === "x" && current === "y") || (axis === "y" && current === "x"))
      return "all";
    return axis;
  }
  if (current === "all") return axis === "x" ? "y" : "x";
  if (current === axis) return "none";
  return current;
};

export const parseTranslatePair = toSpacingPair;
