import type { ComponentType, ReactNode } from 'react';

export type NodeId = string;
export type MaterialType = string;
export type DropPosition = 'before' | 'after' | 'inside';

export type LowCodeNode = {
  id: NodeId;
  type: MaterialType;
  name: string;
  props: Record<string, unknown>;
  children: LowCodeNode[];
};

export type PageSchema = {
  version: string;
  root: LowCodeNode;
};

export type FieldSetter =
  | {
      type: 'text';
      label: string;
      path: string;
      placeholder?: string;
    }
  | {
      type: 'textarea';
      label: string;
      path: string;
      placeholder?: string;
    }
  | {
      type: 'number';
      label: string;
      path: string;
      min?: number;
      max?: number;
      step?: number;
    }
  | {
      type: 'select';
      label: string;
      path: string;
      options: Array<{ label: string; value: string }>;
    };

export type MaterialDefinition = {
  type: MaterialType;
  title: string;
  description: string;
  icon: string;
  allowsChildren: boolean;
  createDefaultNode: () => LowCodeNode;
  setterSchema: FieldSetter[];
  component: ComponentType<RendererProps>;
};

export type RendererProps = {
  node: LowCodeNode;
  children?: ReactNode;
};

export type MaterialPlugin = {
  name: string;
  materials: MaterialDefinition[];
};

export type SchemaTransformer = (schema: PageSchema) => PageSchema;

export type EditorPlugin = {
  name: string;
  materials?: MaterialDefinition[];
  transforms?: SchemaTransformer[];
};

export type EditorSnapshot = {
  schema: PageSchema;
  selectedNodeId: NodeId;
  historyIndex: number;
  historySize: number;
};
