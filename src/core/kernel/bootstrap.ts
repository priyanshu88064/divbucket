import { CORE_PLUGINS } from "@plugins/core";
import { createEditorRegistry } from "./registry";
import type { EditorPlugin, EditorRegistry } from "./types";

const validatePluginIds = (plugins: readonly EditorPlugin[]) => {
  const seen = new Set<string>();
  plugins.forEach((plugin) => {
    if (seen.has(plugin.id)) {
      throw new Error(`Duplicate plugin id: "${plugin.id}"`);
    }
    seen.add(plugin.id);
  });
};

const validateDependencies = (plugins: readonly EditorPlugin[]) => {
  const known = new Set(plugins.map((plugin) => plugin.id));
  plugins.forEach((plugin) => {
    (plugin.dependsOn || []).forEach((dependency) => {
      if (dependency === plugin.id) {
        throw new Error(`Plugin "${plugin.id}" cannot depend on itself`);
      }
      if (!known.has(dependency)) {
        throw new Error(
          `Missing plugin dependency "${dependency}" for "${plugin.id}"`,
        );
      }
    });
  });
};

const topologicallySortPlugins = (
  plugins: readonly EditorPlugin[],
): EditorPlugin[] => {
  const pluginMap = new Map(plugins.map((plugin) => [plugin.id, plugin]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const sorted: EditorPlugin[] = [];

  const visit = (pluginId: string, path: string[]) => {
    if (visited.has(pluginId)) return;
    if (visiting.has(pluginId)) {
      const cycleStart = path.indexOf(pluginId);
      const cyclePath = [...path.slice(cycleStart), pluginId].join(" -> ");
      throw new Error(`Cyclic plugin dependency detected: ${cyclePath}`);
    }

    const plugin = pluginMap.get(pluginId);
    if (!plugin) {
      return;
    }

    visiting.add(pluginId);
    (plugin.dependsOn || []).forEach((dependencyId) => {
      visit(dependencyId, [...path, pluginId]);
    });
    visiting.delete(pluginId);
    visited.add(pluginId);
    sorted.push(plugin);
  };

  plugins.forEach((plugin) => {
    visit(plugin.id, []);
  });

  return sorted;
};

const validateNodeStyleSectionReferences = (registry: EditorRegistry) => {
  registry.listNodeTypes().forEach((nodeDefinition) => {
    (nodeDefinition.styles?.sectionIds || []).forEach((sectionId) => {
      if (!registry.getStyleSection(sectionId)) {
        throw new Error(
          `Unknown style section "${sectionId}" referenced by node "${nodeDefinition.kind}"`,
        );
      }
    });
  });
};

const validatePresetNodeRequirements = (registry: EditorRegistry) => {
  registry.presets.forEach((presetDefinition) => {
    (presetDefinition.requires || []).forEach((nodeKind) => {
      if (!registry.getNodeType(nodeKind)) {
        throw new Error(
          `Unknown required node kind "${nodeKind}" referenced by preset "${presetDefinition.id}"`,
        );
      }
    });
  });
};

const validateNodeEditPanelReferences = (registry: EditorRegistry) => {
  registry.listNodeTypes().forEach((nodeDefinition) => {
    const panelId = nodeDefinition.edit?.panelId;
    if (!panelId) return;
    if (!registry.getEditPanel(panelId)) {
      throw new Error(
        `Unknown edit panel "${panelId}" referenced by node "${nodeDefinition.kind}"`,
      );
    }
  });
};

export const createBootstrappedEditorRegistry = (
  plugins: readonly EditorPlugin[] = CORE_PLUGINS,
): EditorRegistry => {
  validatePluginIds(plugins);
  validateDependencies(plugins);
  const sortedPlugins = topologicallySortPlugins(plugins);

  const registry = createEditorRegistry();
  sortedPlugins.forEach((plugin) => {
    plugin.register(registry);
  });
  validatePresetNodeRequirements(registry);
  validateNodeStyleSectionReferences(registry);
  validateNodeEditPanelReferences(registry);

  return registry;
};

export const editorRegistry = createBootstrappedEditorRegistry();
