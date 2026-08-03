import { useCallback, useEffect, useReducer } from "react";

type UndoableState<T> = { past: T[]; present: T; future: T[] };

type Action<T> = { type: "set"; value: T } | { type: "undo" } | { type: "redo" } | { type: "reset"; value: T };

const MAX_HISTORY = 50;

function reducer<T>(state: UndoableState<T>, action: Action<T>): UndoableState<T> {
  switch (action.type) {
    case "set": {
      if (Object.is(action.value, state.present)) return state;
      const past = [...state.past, state.present].slice(-MAX_HISTORY);
      return { past, present: action.value, future: [] };
    }
    case "undo": {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      return { past: state.past.slice(0, -1), present: previous, future: [state.present, ...state.future] };
    }
    case "redo": {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
    case "reset":
      return { past: [], present: action.value, future: [] };
  }
}

/**
 * Historial deshacer/rehacer puro (reducer, sin mutar refs dentro de un
 * updater de setState — evita duplicados bajo Strict Mode). Pensado para
 * listas reordenables (platos, categorías) y cambios visuales, donde cada
 * `set` es una foto completa del array/objeto tras la acción del usuario.
 */
export function useUndoableState<T>(initial: T) {
  const [state, dispatch] = useReducer(reducer<T>, { past: [], present: initial, future: [] });

  const set = useCallback((value: T) => dispatch({ type: "set", value }), []);
  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const reset = useCallback((value: T) => dispatch({ type: "reset", value }), []);

  return {
    value: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}

/** Atajos de teclado estándar: Ctrl/Cmd+Z deshace, Ctrl/Cmd+Shift+Z (o Ctrl+Y) rehace. */
export function useUndoRedoShortcuts(undo: () => void, redo: () => void) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isModifier = e.ctrlKey || e.metaKey;
      if (!isModifier) return;
      const target = e.target as HTMLElement | null;
      const isEditable = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (isEditable) return;

      if (e.key.toLowerCase() === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      } else if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if (e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);
}
