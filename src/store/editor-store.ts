import { startTransition } from 'react';
import { createInitialSchema } from '../core/schema';
import { applySchemaTransforms } from '../core/plugins';
import { appendChild, detachNode, findNode, insertNode, isNodeInSubtree, mapNode, removeNode } from '../core/tree';
import type { DropPosition, EditorSnapshot, MaterialDefinition, NodeId, PageSchema, SchemaTransformer } from '../core/types';

type Listener = () => void;
type HistoryState = PageSchema;

const STORAGE_KEY = 'lowcode-studio-schema-v1';
const MAX_HISTORY = 40;
const PERSIST_IN_BROWSER = !import.meta.env.DEV;

export type EditorStore = ReturnType<typeof createEditorStore>;

export function createEditorStore(
  materials: Map<string, MaterialDefinition>,
  transforms: SchemaTransformer[] = [],
) {
  const listeners = new Set<Listener>();
  const history = [loadInitialSchema(transforms)];
  let historyIndex = 0;
  let selectedNodeId: NodeId = history[0].root.id;
  let snapshot: EditorSnapshot = {
    schema: history[0],
    selectedNodeId,
    historyIndex,
    historySize: history.length,
  };

  function emit() {
    snapshot = {
      schema: getState(),
      selectedNodeId,
      historyIndex,
      historySize: history.length,
    };
    listeners.forEach((listener) => listener());
  }

  function getState() {
    return history[historyIndex];
  }

  function pushState(next: HistoryState) {
    const preserved = history.slice(0, historyIndex + 1);
    preserved.push(next);

    while (preserved.length > MAX_HISTORY) {
      preserved.shift();
    }

    history.splice(0, history.length, ...preserved);
    historyIndex = history.length - 1;
    persist(next);
  }

  function setSchema(updater: (schema: PageSchema) => PageSchema, nextSelectedNodeId?: NodeId) {
    const current = getState();
    startTransition(() => {
      const nextSchema = updater(current);
      if (nextSchema === current) {
        return;
      }
      pushState(nextSchema);
      selectedNodeId = resolveSelectedNodeId(nextSchema, nextSelectedNodeId ?? selectedNodeId);
      emit();
    });
  }

  function getSnapshot(): EditorSnapshot {
    return snapshot;
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function selectNode(nodeId: NodeId) {
    if (selectedNodeId === nodeId) {
      return;
    }

    selectedNodeId = nodeId;
    emit();
  }

  function createNode(materialType: string, parentId: NodeId) {
    const material = materials.get(materialType);
    if (!material) {
      return;
    }

    const parent = findNode(getState().root, parentId);
    if (!parent || !parentAllowsChildren(parent.type, materials)) {
      return;
    }

    const nextNode = material.createDefaultNode();
    setSchema(
      (schema) => ({
        ...schema,
        root: appendChild(schema.root, parentId, nextNode),
      }),
      nextNode.id,
    );
  }

  function createNodeAt(materialType: string, targetId: NodeId, position: DropPosition) {
    const material = materials.get(materialType);
    if (!material) {
      return;
    }

    const state = getState();
    const targetNode = findNode(state.root, targetId);
    if (!targetNode) {
      return;
    }

    if (position === 'inside' && !parentAllowsChildren(targetNode.type, materials)) {
      return;
    }

    if ((position === 'before' || position === 'after') && state.root.id === targetId) {
      return;
    }

    const nextNode = material.createDefaultNode();
    setSchema((schema) => {
      const inserted = insertNode(schema.root, targetId, nextNode, position);
      if (!inserted) {
        return schema;
      }

      return {
        ...schema,
        root: inserted,
      };
    }, nextNode.id);
  }

  function updateNodeProps(nodeId: NodeId, patch: Record<string, unknown>) {
    setSchema((schema) => ({
      ...schema,
      root: mapNode(schema.root, nodeId, (node) => ({
        ...node,
        props: {
          ...node.props,
          ...patch,
        },
      })),
    }));
  }

  function renameNode(nodeId: NodeId, name: string) {
    setSchema((schema) => ({
      ...schema,
      root: mapNode(schema.root, nodeId, (node) => ({
        ...node,
        name,
      })),
    }));
  }

  function deleteNode(nodeId: NodeId) {
    const state = getState();
    if (state.root.id === nodeId) {
      return;
    }

    setSchema(
      (schema) => ({
        ...schema,
        root: removeNode(schema.root, nodeId),
      }),
      state.root.id,
    );
  }

  function moveNode(nodeId: NodeId, targetId: NodeId, position: DropPosition) {
    const state = getState();
    if (state.root.id === nodeId || nodeId === targetId) {
      return;
    }

    const draggedNode = findNode(state.root, nodeId);
    const targetNode = findNode(state.root, targetId);

    if (!draggedNode || !targetNode || isNodeInSubtree(draggedNode, targetId)) {
      return;
    }

    if (position === 'inside' && !parentAllowsChildren(targetNode.type, materials)) {
      return;
    }

    if ((position === 'before' || position === 'after') && state.root.id === targetId) {
      return;
    }

    setSchema((schema) => {
      const detached = detachNode(schema.root, nodeId);
      if (!detached.node) {
        return schema;
      }

      const inserted = insertNode(detached.root, targetId, detached.node, position);
      if (!inserted) {
        return schema;
      }

      return {
        ...schema,
        root: inserted,
      };
    }, nodeId);
  }

  function undo() {
    if (historyIndex === 0) {
      return;
    }

    historyIndex -= 1;
    selectedNodeId = resolveSelectedNodeId(getState(), selectedNodeId);
    emit();
  }

  function redo() {
    if (historyIndex >= history.length - 1) {
      return;
    }

    historyIndex += 1;
    selectedNodeId = resolveSelectedNodeId(getState(), selectedNodeId);
    emit();
  }

  function reset() {
    const nextSchema = loadInitialSchema(transforms);
    history.splice(0, history.length, nextSchema);
    historyIndex = 0;
    selectedNodeId = nextSchema.root.id;
    persist(nextSchema);
    emit();
  }

  return {
    subscribe,
    getSnapshot,
    selectNode,
    createNode,
    createNodeAt,
    updateNodeProps,
    renameNode,
    deleteNode,
    moveNode,
    undo,
    redo,
    reset,
  };
}

function parentAllowsChildren(type: string, materials: Map<string, MaterialDefinition>) {
  return materials.get(type)?.allowsChildren ?? false;
}

function loadInitialSchema(transforms: SchemaTransformer[]): PageSchema {
  const fallback = applySchemaTransforms(createInitialSchema(), transforms);

  if (typeof window === 'undefined' || !PERSIST_IN_BROWSER) {
    return fallback;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return fallback;
  }

  try {
    return applySchemaTransforms(JSON.parse(raw) as PageSchema, transforms);
  } catch {
    return fallback;
  }
}

function persist(schema: PageSchema) {
  if (typeof window === 'undefined' || !PERSIST_IN_BROWSER) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schema));
}

function resolveSelectedNodeId(schema: PageSchema, currentId: NodeId) {
  return findNode(schema.root, currentId)?.id ?? schema.root.id;
}
