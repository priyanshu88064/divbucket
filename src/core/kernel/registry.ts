import type {
  EditPanelDefinition,
  EditorPluginApi,
  EditorRegistry,
  NodeTypeDefinition,
  PresetDefinition,
  StyleSectionDefinition,
} from "./types";
import type { PresetId, NodeKind } from "@core/types/document";

const throwDuplicateError = (category: string, id: string) => {
  throw new Error(`Duplicate ${category} registration: "${id}"`);
};

export class InMemoryEditorRegistry implements EditorRegistry, EditorPluginApi {
  readonly nodes = new Map<NodeKind, NodeTypeDefinition>();
  readonly presets = new Map<PresetId, PresetDefinition>();

  private readonly nodeOrder: NodeKind[] = [];
  private readonly presetOrder: PresetId[] = [];
  private readonly styleSections = new Map<string, StyleSectionDefinition>();
  private readonly styleSectionOrder: string[] = [];
  private readonly editPanels = new Map<string, EditPanelDefinition>();
  private readonly editPanelOrder: string[] = [];

  registerNodeType(definition: NodeTypeDefinition) {
    if (this.nodes.has(definition.kind)) {
      throwDuplicateError("node kind", definition.kind);
    }
    this.nodes.set(definition.kind, definition);
    this.nodeOrder.push(definition.kind);
  }

  registerPreset(definition: PresetDefinition) {
    if (this.presets.has(definition.id)) {
      throwDuplicateError("preset id", definition.id);
    }
    this.presets.set(definition.id, definition);
    this.presetOrder.push(definition.id);
  }

  registerStyleSection(definition: StyleSectionDefinition) {
    if (this.styleSections.has(definition.id)) {
      throwDuplicateError("style section id", definition.id);
    }
    this.styleSections.set(definition.id, definition);
    this.styleSectionOrder.push(definition.id);
  }

  registerEditPanel(definition: EditPanelDefinition) {
    if (this.editPanels.has(definition.id)) {
      throwDuplicateError("edit panel id", definition.id);
    }
    this.editPanels.set(definition.id, definition);
    this.editPanelOrder.push(definition.id);
  }

  getNodeType(kind: NodeKind) {
    return this.nodes.get(kind);
  }

  listNodeTypes() {
    return this.nodeOrder
      .map((kind) => this.nodes.get(kind))
      .filter((node): node is NodeTypeDefinition => Boolean(node));
  }

  getPreset(id: PresetId) {
    return this.presets.get(id);
  }

  listPresets() {
    return this.presetOrder
      .map((id) => this.presets.get(id))
      .filter((preset): preset is PresetDefinition => Boolean(preset));
  }

  getStyleSection(id: string) {
    return this.styleSections.get(id);
  }

  getEditPanel(id: string) {
    return this.editPanels.get(id);
  }

  listStyleSections() {
    return this.styleSectionOrder
      .map((id) => this.styleSections.get(id))
      .filter((section): section is StyleSectionDefinition => Boolean(section));
  }

  listEditPanels() {
    return this.editPanelOrder
      .map((id) => this.editPanels.get(id))
      .filter((panel): panel is EditPanelDefinition => Boolean(panel));
  }
}

export const createEditorRegistry = () => new InMemoryEditorRegistry();
