import { createId } from './create-id';
import type { PageSchema } from './types';

export const SCHEMA_VERSION = '1.0.0';

export function createInitialSchema(): PageSchema {
  return {
    version: SCHEMA_VERSION,
    root: {
      id: createId('page'),
      type: 'container',
      name: '页面',
      props: {
        direction: 'column',
        gap: 16,
        padding: 24,
        background: '#ffffff',
      },
      children: [],
    },
  };
}
