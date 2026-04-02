let counter = 0;

export function createId(prefix = 'node') {
  counter += 1;
  return `${prefix}_${counter}`;
}
