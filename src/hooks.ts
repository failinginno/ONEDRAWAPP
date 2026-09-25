import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Fires while the element is intersecting the viewport. */
export function useInView<T extends Element>(ref: RefObject<T>, threshold = 0.35) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold,
    });

    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  return inView;
}

/** Steps through a fixed sequence, but only while the element is on screen. */
export function useCycle(length: number, interval: number, active: boolean) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }

    const id = window.setInterval(() => {
      setStep((v) => (v + 1) % length);
    }, interval);

    return () => window.clearInterval(id);
  }, [active, length, interval]);

  return step;
}
