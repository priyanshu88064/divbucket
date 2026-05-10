import type { CSSProperties, ReactNode } from "react";
import type {
  BackgroundType,
  CssState,
  NodeRecord,
  NodeStyleUi,
  SpacingLinkMode,
} from "@core/types/document";

export interface StyleTarget {
  cssState: CssState;
}

export interface StyleInspectorContext {
  id: number;
  node: NodeRecord;
  style: CSSProperties;
  styleUi?: NodeStyleUi;
  target: StyleTarget;
  setStyle: (nextStyle: CSSProperties) => void;
  patchStyle: (
    patch: Partial<
      Record<keyof CSSProperties | string, string | number | undefined>
    >,
  ) => void;
  setStyleUi: (next: NodeStyleUi | undefined) => void;
}

export type FieldVisibilityRule = (ctx: StyleInspectorContext) => boolean;

export interface TextFieldConfig {
  id: string;
  type: "text";
  label: string;
  prop: keyof CSSProperties;
  units?: string[];
  selectOnly?: boolean;
  defaultValue?: string;
  visible?: FieldVisibilityRule;
}

export interface ColorFieldConfig {
  id: string;
  type: "color";
  label: string;
  prop: keyof CSSProperties;
  defaultValue: string;
  visible?: FieldVisibilityRule;
}

export interface SelectFieldConfig {
  id: string;
  type: "select";
  label: string;
  value: (ctx: StyleInspectorContext) => string;
  options: { label: string; value: string }[];
  onChange: (ctx: StyleInspectorContext, value: string) => void;
  visible?: FieldVisibilityRule;
}

export interface CheckboxFieldConfig {
  id: string;
  type: "checkbox";
  label: string;
  checked: (ctx: StyleInspectorContext) => boolean;
  onChange: (ctx: StyleInspectorContext, checked: boolean) => void;
  visible?: FieldVisibilityRule;
}

export interface ToggleGroupFieldConfig {
  id: string;
  type: "toggle-group";
  label: string;
  value: (ctx: StyleInspectorContext) => string;
  options: { label: string; value: string }[];
  onChange: (ctx: StyleInspectorContext, value: string) => void;
  visible?: FieldVisibilityRule;
}

export interface CompositeFieldConfig {
  id: string;
  type: "composite";
  render: (ctx: StyleInspectorContext) => ReactNode;
  visible?: FieldVisibilityRule;
}

export type StyleFieldConfig =
  | TextFieldConfig
  | ColorFieldConfig
  | SelectFieldConfig
  | CheckboxFieldConfig
  | ToggleGroupFieldConfig
  | CompositeFieldConfig;

export interface StyleSectionConfig {
  id: string;
  title: string;
  fields: StyleFieldConfig[];
  visible?: FieldVisibilityRule;
}

export interface ShadowValue {
  level: string;
  color: string;
}

export interface TransformValue {
  translateX: string;
  translateY: string;
  scaleX: string;
  scaleY: string;
  rotate: string;
}

export interface BackgroundModeValue {
  mode: BackgroundType;
}

export interface SpacingAxisValue {
  linkMode: SpacingLinkMode;
}
