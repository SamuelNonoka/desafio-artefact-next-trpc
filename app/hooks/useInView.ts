import { useEffect, useRef } from "react";

/**
 * Calls "onVisible" when the element enters the viewport (200px in advance).
 * Used as a "sentinel" at the end of the list for infinite scroll.
 */
export function useInView<T extends Element>(
  onVisible: () => void,
  enabled: boolean,
) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(onVisible);

  useEffect(() => {
    callbackRef.current = onVisible;
  });

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) callbackRef.current();
      },
      { rootMargin: "200px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return ref;
}
