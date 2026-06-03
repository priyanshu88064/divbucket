import type {
  CSSProperties,
  ComponentType,
  MouseEvent,
  ReactNode,
} from "react";
import type {
  NodeRecord,
  PresetId,
  NodeKind,
  TreeState,
} from "@core/types/document";
import type { InstantiatedTemplate } from "@core/utils/template";
import type { StyleSectionConfig } from "../components/Cssbar/tabs/CssTab/styleInspector/types";

type NodeRecordByKind<K extends NodeKind> = Extract<NodeRecord, { type: K }>;

export interface NodeRendererProps {
  id: number;
  type: NodeKind;
  style: CSSProperties;
  record?: NodeRecord;
  content?: string;
  media?: {
    src?: string;
    alt?: string;
    autoPlay?: boolean;
    muted?: boolean;
    controls?: boolean;
    loop?: boolean;
  };
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  onContextMenu?: (e: MouseEvent<HTMLElement>) => void;
  onMouseOver?: (e: MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
  registerElement?: (id: number, element: HTMLElement | null) => void;
}

export interface NodeSidebarDefinition {
  visible: boolean;
  group: string;
  order: number;
}

export type NodeEditFieldKey =
  | "name"
  | "content"
  | "hyperlink"
  | "media.src"
  | "media.alt"
  | "media.autoPlay"
  | "media.controls"
  | "media.loop"
  | "media.muted";

export interface NodeEditDefinition {
  panelId: string;
  fields?: NodeEditFieldKey[];
}

export interface NodeStyleContributions {
  sectionIds: string[];
}

export type NodeExportAttributeValue = string | boolean | undefined;

export interface NodeExportDefinition {
  tag: string;
  selfClosing?: boolean;
  getAttributes?: (
    record: NodeRecord,
  ) => Record<string, NodeExportAttributeValue>;
  getInnerHtml?: (record: NodeRecord) => string;
}

export interface NodeTypeDefinition<K extends NodeKind = NodeKind> {
  kind: K;
  label: string;
  icon: () => ReactNode;
  isContainer: boolean;
  sidebar: NodeSidebarDefinition;
  renderer: (props: NodeRendererProps) => ReactNode;
  createRecord: () => NodeRecordByKind<K>;
  createStyle: () => CSSProperties;
  acceptsChild?: (childKind: NodeKind) => boolean;
  edit?: NodeEditDefinition;
  styles?: NodeStyleContributions;
  export?: NodeExportDefinition;
}

export interface PresetDefinition {
  id: PresetId;
  label: string;
  group: string;
  order: number;
  icon?: () => ReactNode;
  requires?: NodeKind[];
  instantiate: (input: {
    treeState: Pick<
      TreeState,
      "pageIds" | "nodeChildrenMap" | "nodeRecordMap" | "nodeStyleMap"
    >;
    name?: string;
    registry: EditorRegistry;
  }) => InstantiatedTemplate;
}

export type StyleSectionDefinition = StyleSectionConfig;

export interface EditPanelProps {
  id: number;
  focus: string;
  nodeDefinition: NodeTypeDefinition;
  draftRecord: NodeRecord;
  setDraftRecord: (
    next:
      | NodeRecord
      | ((previousRecord: NodeRecord) => NodeRecord),
  ) => void;
  commitDraftRecord: (nextRecord?: NodeRecord) => void;
}

export interface EditPanelDefinition {
  id: string;
  component: ComponentType<EditPanelProps>;
}

export type PaletteLauncherTrigger = "click" | "hover";
export type PaletteLauncherSurface = "inline" | "popover";
export type PaletteLauncherPlacement = "right-center" | "right-start";

export interface PaletteLauncherRenderProps {
  open: boolean;
  close: () => void;
}

export interface PaletteLauncherDefinition {
  id: string;
  label: string;
  group: string;
  order: number;
  trigger: PaletteLauncherTrigger;
  surface?: PaletteLauncherSurface;
  placement?: PaletteLauncherPlacement;
  offset?: number;
  icon: () => ReactNode;
  searchTokens?: string[];
  renderPanel: (props: PaletteLauncherRenderProps) => ReactNode;
}

export interface EditorPluginApi {
  registerNodeType: (definition: NodeTypeDefinition) => void;
  registerPreset: (definition: PresetDefinition) => void;
  registerStyleSection: (definition: StyleSectionDefinition) => void;
  registerEditPanel: (definition: EditPanelDefinition) => void;
  registerPaletteLauncher: (definition: PaletteLauncherDefinition) => void;
}

export interface EditorPlugin {
  id: string;
  dependsOn?: string[];
  register: (api: EditorPluginApi) => void;
}

export interface EditorRegistry {
  readonly nodes: ReadonlyMap<NodeKind, NodeTypeDefinition>;
  readonly presets: ReadonlyMap<PresetId, PresetDefinition>;
  getNodeType: (kind: NodeKind) => NodeTypeDefinition | undefined;
  listNodeTypes: () => NodeTypeDefinition[];
  getPreset: (id: PresetId) => PresetDefinition | undefined;
  listPresets: () => PresetDefinition[];
  getStyleSection: (id: string) => StyleSectionDefinition | undefined;
  getEditPanel: (id: string) => EditPanelDefinition | undefined;
  getPaletteLauncher: (id: string) => PaletteLauncherDefinition | undefined;
  listStyleSections: () => StyleSectionDefinition[];
  listEditPanels: () => EditPanelDefinition[];
  listPaletteLaunchers: () => PaletteLauncherDefinition[];
}
