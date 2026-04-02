import { resolveDropPosition } from './drag-utils';
import { visitTree } from '../core/tree';
import type { DropPosition, LowCodeNode, MaterialDefinition, NodeId } from '../core/types';

type OutlineTreeProps = {
  root: LowCodeNode;
  materials: Map<string, MaterialDefinition>;
  selectedNodeId: NodeId;
  draggedNodeId: NodeId | null;
  dropTarget: { nodeId: NodeId; position: DropPosition } | null;
  onSelect: (nodeId: NodeId) => void;
  onDragStart: (nodeId: NodeId) => void;
  onDragEnd: () => void;
  onDragOverNode: (nodeId: NodeId, position: DropPosition) => void;
  onDropNode: (nodeId: NodeId, position: DropPosition) => void;
};

export function OutlineTree({
  root,
  materials,
  selectedNodeId,
  draggedNodeId,
  dropTarget,
  onSelect,
  onDragStart,
  onDragEnd,
  onDragOverNode,
  onDropNode,
}: OutlineTreeProps) {
  const items: Array<{ id: NodeId; name: string; type: string; depth: number; allowsChildren: boolean }> = [];

  visitTree(root, (node, depth) => {
    items.push({
      id: node.id,
      name: node.name,
      type: node.type,
      depth,
      allowsChildren: materials.get(node.type)?.allowsChildren ?? false,
    });
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>页面结构</h2>
        <span>{items.length} 个节点</span>
      </div>
      <div className="outline-list">
        {items.map((item) => (
          <div
            key={item.id}
            className={getDropClassName(
              item.id === selectedNodeId ? 'outline-item outline-item-selected' : 'outline-item',
              dropTarget,
              item.id,
            )}
            style={{ paddingLeft: `${12 + item.depth * 18}px` }}
            draggable={item.id !== root.id}
            onClick={() => onSelect(item.id)}
            onDragStart={(event) => {
              if (item.id === root.id) {
                event.preventDefault();
                return;
              }

              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', item.id);
              onDragStart(item.id);
            }}
            onDragEnd={onDragEnd}
            onDragOver={(event) => {
              if (!draggedNodeId || draggedNodeId === item.id) {
                return;
              }

              event.preventDefault();
              const position = resolveDropPosition(event.clientY, event.currentTarget.getBoundingClientRect(), item.allowsChildren);
              onDragOverNode(item.id, position);
            }}
            onDrop={(event) => {
              if (!draggedNodeId || draggedNodeId === item.id) {
                return;
              }

              event.preventDefault();
              const position = resolveDropPosition(event.clientY, event.currentTarget.getBoundingClientRect(), item.allowsChildren);
              onDropNode(item.id, position);
            }}
          >
            <strong>{item.name}</strong>
            <small>{item.type}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function getDropClassName(baseClassName: string, dropTarget: { nodeId: NodeId; position: DropPosition } | null, nodeId: NodeId) {
  if (!dropTarget || dropTarget.nodeId !== nodeId) {
    return baseClassName;
  }

  return `${baseClassName} outline-item-drop-${dropTarget.position}`;
}
