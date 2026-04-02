import type { DropPosition, LowCodeNode, NodeId } from './types';

export function mapNode(
  node: LowCodeNode,
  targetId: NodeId,
  updater: (current: LowCodeNode) => LowCodeNode,
): LowCodeNode {
  if (node.id === targetId) {
    return updater(node);
  }

  return {
    ...node,
    children: node.children.map((child) => mapNode(child, targetId, updater)),
  };
}

export function findNode(node: LowCodeNode, targetId: NodeId): LowCodeNode | null {
  if (node.id === targetId) {
    return node;
  }

  for (const child of node.children) {
    const match = findNode(child, targetId);
    if (match) {
      return match;
    }
  }

  return null;
}

export function appendChild(root: LowCodeNode, parentId: NodeId, child: LowCodeNode): LowCodeNode {
  return mapNode(root, parentId, (current) => ({
    ...current,
    children: [...current.children, child],
  }));
}

export function removeNode(root: LowCodeNode, nodeId: NodeId): LowCodeNode {
  return {
    ...root,
    children: root.children
      .filter((child) => child.id !== nodeId)
      .map((child) => removeNode(child, nodeId)),
  };
}

export function detachNode(root: LowCodeNode, nodeId: NodeId): { root: LowCodeNode; node: LowCodeNode | null } {
  let detachedNode: LowCodeNode | null = null;

  function walk(current: LowCodeNode): LowCodeNode {
    const nextChildren: LowCodeNode[] = [];

    current.children.forEach((child) => {
      if (child.id === nodeId) {
        detachedNode = child;
        return;
      }

      nextChildren.push(walk(child));
    });

    if (nextChildren === current.children) {
      return current;
    }

    return {
      ...current,
      children: nextChildren,
    };
  }

  return {
    root: walk(root),
    node: detachedNode,
  };
}

export function insertNode(
  root: LowCodeNode,
  targetId: NodeId,
  incomingNode: LowCodeNode,
  position: DropPosition,
): LowCodeNode | null {
  if (position === 'inside' && root.id === targetId) {
    return {
      ...root,
      children: [...root.children, incomingNode],
    };
  }

  let inserted = false;

  function walk(current: LowCodeNode): LowCodeNode {
    if (position === 'inside' && current.id === targetId) {
      inserted = true;
      return {
        ...current,
        children: [...current.children, incomingNode],
      };
    }

    const nextChildren: LowCodeNode[] = [];

    current.children.forEach((child) => {
      if (child.id === targetId && position === 'before') {
        inserted = true;
        nextChildren.push(incomingNode, child);
        return;
      }

      if (child.id === targetId && position === 'after') {
        inserted = true;
        nextChildren.push(child, incomingNode);
        return;
      }

      nextChildren.push(walk(child));
    });

    return {
      ...current,
      children: nextChildren,
    };
  }

  const nextRoot = walk(root);
  return inserted ? nextRoot : null;
}

export function isNodeInSubtree(node: LowCodeNode, targetId: NodeId): boolean {
  if (node.id === targetId) {
    return true;
  }

  return node.children.some((child) => isNodeInSubtree(child, targetId));
}

export function visitTree(
  node: LowCodeNode,
  visitor: (current: LowCodeNode, depth: number) => void,
  depth = 0,
) {
  visitor(node, depth);
  node.children.forEach((child) => visitTree(child, visitor, depth + 1));
}
