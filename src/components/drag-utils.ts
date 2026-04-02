import type { DropPosition } from '../core/types';

export function resolveDropPosition(
  clientY: number,
  bounds: DOMRect,
  allowsChildren: boolean,
): DropPosition {
  const relativeY = clientY - bounds.top;
  const ratio = relativeY / bounds.height;

  if (allowsChildren && ratio >= 0.3 && ratio <= 0.7) {
    return 'inside';
  }

  return ratio < 0.5 ? 'before' : 'after';
}
