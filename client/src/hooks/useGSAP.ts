import { useRef, useEffect, type DependencyList, type RefObject } from "react";
import { gsap } from "@/lib/gsap";

type ContextFunc = (context: gsap.Context) => void;

/**
 * Scoped GSAP hook — all animations created inside `fn` are automatically
 * cleaned up when the component unmounts (or deps change).
 *
 * @param fn      Function that creates GSAP animations
 * @param scope   Optional ref to scope querySelector calls
 * @param deps    Dependency array (like useEffect)
 */
export function useGSAP(
  fn: ContextFunc,
  scope?: RefObject<Element | null>,
  deps: DependencyList = []
) {
  const ctx = useRef<gsap.Context | null>(null);

  useEffect(() => {
    ctx.current = gsap.context(fn, scope?.current ?? undefined);
    return () => {
      ctx.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctx;
}
