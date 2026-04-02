import { useSyncExternalStore } from 'react';
import type { EditorStore } from '../store/editor-store';

export function useEditorStore<T>(
  store: EditorStore,
  selector: (snapshot: ReturnType<EditorStore['getSnapshot']>) => T,
) {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getSnapshot()),
    () => selector(store.getSnapshot()),
  );
}
