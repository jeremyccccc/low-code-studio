import { resolveDropPosition } from './drag-utils';
import type { DropPosition, LowCodeNode, MaterialDefinition, NodeId } from '../core/types';

type RendererTreeProps = {
  node: LowCodeNode;
  rootId: NodeId;
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
};

export function RendererTree({
  node,
  rootId,
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
}: RendererTreeProps) {
  const material = materials.get(node.type);
  if (!material) {
    return (
      <div className="missing-node" onClick={() => onSelect(node.id)}>
        未注册组件: {node.type}
      </div>
    );
  }

  const Component = material.component;
  const isSelected = node.id === selectedNodeId;
  const isDropTarget = dropTarget?.nodeId === node.id;
  const className = [
    'node-shell',
    isSelected ? 'node-shell-selected' : '',
    isDropTarget ? `node-shell-drop-${dropTarget.position}` : '',
    draggedNodeId === node.id ? 'node-shell-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect(node.id);
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
      onDragOver={(event) => {
        if ((!draggedNodeId && !draggedMaterialType) || draggedNodeId === node.id) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        const position = resolveDropPosition(event.clientY, event.currentTarget.getBoundingClientRect(), material.allowsChildren);
        onDragOverNode(node.id, position);
      }}
      onDrop={(event) => {
        if ((!draggedNodeId && !draggedMaterialType) || draggedNodeId === node.id) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        const position = resolveDropPosition(event.clientY, event.currentTarget.getBoundingClientRect(), material.allowsChildren);
        onDropNode(node.id, position);
      }}
    >
      {node.id !== rootId ? (
        <div
          className="node-handle"
          draggable
          onDragStart={(event) => {
            event.stopPropagation();
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', node.id);
            onDragStart(node.id);
          }}
          onDragEnd={(event) => {
            event.stopPropagation();
            onDragEnd();
          }}
        >
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : null}
      <Component node={node}>
        {node.children.map((child) => (
          <RendererTree
            key={child.id}
            node={child}
            rootId={rootId}
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
        ))}
      </Component>
    </div>
  );
}
