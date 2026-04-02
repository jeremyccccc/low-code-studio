import { builtinMaterialPlugin } from './materials';
import type { EditorPlugin, MaterialDefinition, PageSchema, SchemaTransformer } from './types';

export type PluginRuntime = {
  materials: Map<string, MaterialDefinition>;
  transforms: SchemaTransformer[];
};

export function createPluginRuntime(extraPlugins: EditorPlugin[] = []): PluginRuntime {
  const materials = new Map<string, MaterialDefinition>();
  const transforms: SchemaTransformer[] = [];

  for (const material of builtinMaterialPlugin.materials) {
    materials.set(material.type, material);
  }

  for (const plugin of extraPlugins) {
    plugin.materials?.forEach((material) => {
      materials.set(material.type, material);
    });
    plugin.transforms?.forEach((transform) => {
      transforms.push(transform);
    });
  }

  return { materials, transforms };
}

export function applySchemaTransforms(schema: PageSchema, transforms: SchemaTransformer[]) {
  return transforms.reduce((current, transform) => transform(current), schema);
}
