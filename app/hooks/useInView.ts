import { useEffect, useRef } from "react";

/**
 * Chama "onVisible" quando o elemento entra na tela (com 200px de antecedência).
 * Usado como "sentinela" no fim da lista para o scroll infinito.
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
