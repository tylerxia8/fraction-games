import { useCallback, useEffect, useState } from 'react';

export function useRunTimer(running: boolean) {
  const [startAt, setStartAt] = useState(() => Date.now());
  const [tick, setTick] = useState(() => Date.now());
  const [finalMs, setFinalMs] = useState<number | null>(null);

  useEffect(() => {
    if (!running || finalMs !== null) return;
    const id = window.setInterval(() => setTick(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [running, finalMs]);

  const stop = useCallback(() => {
    setFinalMs((prev) => {
      if (prev !== null) return prev;
      return Date.now() - startAt;
    });
  }, [startAt]);

  const reset = useCallback(() => {
    const now = Date.now();
    setStartAt(now);
    setTick(now);
    setFinalMs(null);
  }, []);

  const elapsedMs = finalMs ?? tick - startAt;

  return { elapsedMs, finalMs, stop, reset };
}
