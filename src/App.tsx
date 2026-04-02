import { useState } from 'react';
import { Canvas } from './components/canvas';
import { MaterialLibrary } from './components/material-library';
import { PropertiesPanel } from './components/properties-panel';
import { createPluginRuntime } from './core/plugins';
import { findNode } from './core/tree';
import type { DropPosition, MaterialDefinition, NodeId } from './core/types';
import { useEditorStore } from './hooks/use-editor-store';
import { marketingPlugin } from './plugins/marketing-plugin';
import { createEditorStore } from './store/editor-store';

const runtime = createPluginRuntime([marketingPlugin]);
const editorStore = createEditorStore(runtime.materials, runtime.transforms);

function sortMaterials(materials: Map<string, MaterialDefinition>) {
  return [...materials.values()].sort((left, right) => left.title.localeCompare(right.title, 'zh-CN'));
}

export function App() {
  const snapshot = useEditorStore(editorStore, (current) => current);
  const selectedNode = findNode(snapshot.schema.root, snapshot.selectedNodeId);
  const selectedMaterial = selectedNode ? runtime.materials.get(selectedNode.type) : null;
  const materialList = sortMaterials(runtime.materials);
  const [copied, setCopied] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<NodeId | null>(null);
  const [draggedMaterialType, setDraggedMaterialType] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ nodeId: NodeId; position: DropPosition } | null>(null);
  const addTargetId = selectedMaterial?.allowsChildren ? selectedNode?.id ?? snapshot.schema.root.id : snapshot.schema.root.id;

  function clearDragState() {
    setDraggedNodeId(null);
    setDraggedMaterialType(null);
    setDropTarget(null);
  }

  function handleDropNode(targetId: NodeId, position: DropPosition) {
    if (draggedMaterialType) {
      editorStore.createNodeAt(draggedMaterialType, targetId, position);
      clearDragState();
      return;
    }

    if (draggedNodeId) {
      editorStore.moveNode(draggedNodeId, targetId, position);
    }
    clearDragState();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">React Low Code Studio</p>
          <h1>可扩展的低代码平台骨架</h1>
        </div>
        <div className="topbar-actions">
          <button onClick={() => editorStore.undo()} disabled={snapshot.historyIndex === 0}>
            撤销
          </button>
          <button onClick={() => editorStore.redo()} disabled={snapshot.historyIndex >= snapshot.historySize - 1}>
            重做
          </button>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(JSON.stringify(snapshot.schema, null, 2));
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? '已复制 Schema' : '复制 Schema'}
          </button>
          <button onClick={() => editorStore.reset()}>重置示例</button>
        </div>
      </header>

      <main className="workspace">
        <aside className="sidebar sidebar-tools materials-sidebar">
          <MaterialLibrary
            materials={materialList}
            draggedMaterialType={draggedMaterialType}
            onAdd={(materialType) => editorStore.createNode(materialType, addTargetId)}
            onMaterialDragStart={(materialType) => {
              setDraggedMaterialType(materialType);
              setDraggedNodeId(null);
            }}
            onMaterialDragEnd={clearDragState}
          />
        </aside>

        <Canvas
          root={snapshot.schema.root}
          materials={runtime.materials}
          selectedNodeId={snapshot.selectedNodeId}
          draggedNodeId={draggedNodeId}
          draggedMaterialType={draggedMaterialType}
          dropTarget={dropTarget}
          onSelect={(nodeId) => editorStore.selectNode(nodeId)}
          onDragStart={(nodeId) => {
            setDraggedNodeId(nodeId);
            setDraggedMaterialType(null);
          }}
          onDragEnd={clearDragState}
          onDragOverNode={(nodeId, position) => setDropTarget({ nodeId, position })}
          onDropNode={handleDropNode}
          onStageDragOver={() => setDropTarget({ nodeId: snapshot.schema.root.id, position: 'inside' })}
          onStageDrop={() => handleDropNode(snapshot.schema.root.id, 'inside')}
        />

        <aside className="sidebar">
          <PropertiesPanel
            node={selectedNode}
            fields={selectedMaterial?.setterSchema ?? []}
            isRoot={snapshot.schema.root.id === selectedNode?.id}
            onRename={(name) => {
              if (selectedNode) {
                editorStore.renameNode(selectedNode.id, name);
              }
            }}
            onPatchProps={(patch) => {
              if (selectedNode) {
                editorStore.updateNodeProps(selectedNode.id, patch);
              }
            }}
            onDelete={() => {
              if (selectedNode) {
                editorStore.deleteNode(selectedNode.id);
              }
            }}
          />
          <section className="panel">
            <div className="panel-header">
              <h2>扩展点</h2>
            </div>
            <ul className="extension-list">
              <li>通过 `EditorPlugin.materials` 注入新物料</li>
              <li>通过 `setterSchema` 扩展属性面板字段</li>
              <li>通过 schema transform 处理版本迁移</li>
              <li>后续可在按钮上接动作编排和数据源绑定</li>
            </ul>
          </section>
        </aside>
      </main>
    </div>
  );
}
