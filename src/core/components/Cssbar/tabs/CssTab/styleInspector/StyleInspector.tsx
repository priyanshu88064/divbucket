import TextInput from "@core/utils/inputs/TextInput/TextInput";
import Colorpicker from "@core/utils/inputs/Colorpicker/Colorpicker";
import CheckBox from "@core/utils/inputs/CheckBox/CheckBox";
import Wrap from "../../../Wrap";
import styles from "../../../cssbar.module.css";
import { editorRegistry } from "@core/kernel/bootstrap";
import type { StyleFieldConfig, StyleInspectorContext } from "./types";
import { memo } from "react";
import { useRenderCounter } from "@core/hooks/useRenderCounter";
import { resolveStyleSectionsForNode } from "./resolver";

const renderField = (field: StyleFieldConfig, ctx: StyleInspectorContext) => {
  if (field.visible && !field.visible(ctx)) return null;

  if (field.type === "composite") {
    return <div key={field.id}>{field.render(ctx)}</div>;
  }

  if (field.type === "toggle-group") {
    const selected = field.value(ctx);
    return (
      <div key={field.id} className={`${styles.dic0} ${styles.beffect}`}>
        {field.options.map((option) => (
          <div
            key={option.value}
            className={`${selected === option.value ? styles.beffectactivediv : ""}`}
            onClick={() => field.onChange(ctx, option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>
    );
  }

  if (field.type === "checkbox") {
    return (
      <div key={field.id} className={styles.bg0}>
        <CheckBox
          name={field.label}
          checked={field.checked(ctx)}
          onChange={(e) => field.onChange(ctx, e.target.checked)}
        />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div key={field.id} className={styles.bg0}>
        <div className={styles.bg0name}>{field.label}</div>
        <div className={styles.sizesiwrap}>
          <TextInput
            value={field.value(ctx)}
            units={field.options.map((option) => option.value)}
            onChange={(value) => field.onChange(ctx, value)}
            isSelectOnly={true}
          />
        </div>
      </div>
    );
  }

  if (field.type === "color") {
    const value = ((ctx.style[field.prop] as string) ||
      field.defaultValue) as string;
    return (
      <div key={field.id} className={styles.bg0}>
        <div className={styles.bg0name}>{field.label}</div>
        <div className={styles.sizesiwrap}>
          <Colorpicker
            value={value}
            onChange={(next) => ctx.patchStyle({ [field.prop]: next })}
          />
        </div>
      </div>
    );
  }

  const value = ((ctx.style[field.prop] as string | undefined) ||
    field.defaultValue ||
    "auto") as string;
  return (
    <div key={field.id} className={styles.bg0}>
      <div className={styles.bg0name}>{field.label}</div>
      <div className={styles.sizesiwrap}>
        <TextInput
          value={value}
          units={field.units}
          onChange={(next) => ctx.patchStyle({ [field.prop]: next })}
          isSelectOnly={field.selectOnly}
        />
      </div>
    </div>
  );
};

function StyleInspector({
  ctx,
}: {
  ctx: StyleInspectorContext;
}) {
  useRenderCounter("StyleInspector");
  const resolvedSections = resolveStyleSectionsForNode({
    ctx,
    registry: editorRegistry,
  });

  return (
    <>
      {resolvedSections.map((section) => {
        if (section.visible && !section.visible(ctx)) return null;
        const sectionFields = section.fields
          .map((field) => renderField(field, ctx))
          .filter(Boolean);
        if (sectionFields.length === 0) return null;

        return (
          <Wrap key={section.id} title={section.title}>
            <div className={`${styles.padwrap} ${styles.bgwrap}`}>
              {sectionFields}
            </div>
          </Wrap>
        );
      })}
    </>
  );
}

export default memo(StyleInspector);
