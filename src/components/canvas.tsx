import type { DropPosition, LowCodeNode, MaterialDefinition, NodeId } from '../core/types';
import { RendererTree } from './renderer';

type CanvasProps = {
  root: LowCodeNode;
  materials: Map<string, MaterialDefinition>;
  selectedNodeId: NodeId;
  draggedNodeId: NodeId | null;
  draggedMaterialType: string | null;
  dropTarget: { nodeId: NodeId; position: DropPosition } | null;
  onSelect: (nodeId: NodeId) => void;
  onDragStart: (nodeId: NodeId) => void;
  onDragEnd: () => void;
  onDragOverNode: (nodeId: NodeId, position: DropPosition) => void;
  onDropNode: (nodeId: NodeId, position: DropPosition) => void;
  onStageDragOver: () => void;
  onStageDrop: () => void;
};

export function Canvas({
  root,
  materials,
  selectedNodeId,
  draggedNodeId,
  draggedMaterialType,
  dropTarget,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOverNode,
  onDropNode,
  onStageDragOver,
  onStageDrop,
}: CanvasProps) {
  return (
    <section className="canvas-panel">
      <div className="panel-header">
        <h2>画布预览</h2>
        <span>Schema 驱动渲染</span>
      </div>
      <div
        className={draggedMaterialType ? 'canvas-stage canvas-stage-material-drag' : 'canvas-stage'}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            onSelect(root.id);
          }
        }}
        onDragOver={(event) => {
          if (!draggedMaterialType && !draggedNodeId) {
            return;
          }

          event.preventDefault();
          onStageDragOver();
        }}
        onDrop={(event) => {
          if (!draggedMaterialType && !draggedNodeId) {
            return;
          }

          event.preventDefault();
          onStageDrop();
        }}
      >
        {root.children.length === 0 ? (
          <div className="canvas-empty-state">
            <strong>空白画布</strong>
            <span>从左侧拖动物料到这里，开始搭建页面</span>
          </div>
        ) : null}
        <RendererTree
          node={root}
          rootId={root.id}
          materials={materials}
          selectedNodeId={selectedNodeId}
          draggedNodeId={draggedNodeId}
          draggedMaterialType={draggedMaterialType}
          dropTarget={dropTarget}
          onSelect={onSelect}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOverNode={onDragOverNode}
          onDropNode={onDropNode}
        />
      </div>
    </section>
  );
}
