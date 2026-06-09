import { useState, useRef, useCallback } from 'react';

const DEFAULT_CLEAR_MS = 15_000; 

export function useClipboard(clearAfterMs = DEFAULT_CLEAR_MS) {
  const [copiedId, setCopiedId] = useState(null);
  const timerRef = useRef(null);

  const copy = useCallback(
    async (text, id) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(async () => {
          try {
            await navigator.clipboard.writeText('');
          } catch (_) {
            console.log(`Failed to clear clipboard ${_}`);
          }
          setCopiedId(null);
        }, clearAfterMs);
      } catch (e) {
        console.error('Clipboard copy failed:', e);
      }
    },
    [clearAfterMs]
  );

  return { copiedId, copy };
}
