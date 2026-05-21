'use client';

import { Suspense, lazy, useEffect, useRef } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

/** Aggressively removes the "Built with Spline" badge via MutationObserver + timeouts. */
function useHideSplineBadge(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const wrapper = ref.current;
    if (!wrapper) return;

    const hide = (el: Element) => {
      (el as HTMLElement).style.cssText += ';display:none!important;visibility:hidden!important;opacity:0!important;';
    };

    const removeBadge = () => {
      // Anchor pointing to spline.design + its parent wrapper
      wrapper.querySelectorAll('a[href*="spline.design"], a[href*="spline.design"] *').forEach(el => {
        hide(el);
        if (el.parentElement) hide(el.parentElement);
      });
      // Any div sibling right after a canvas element
      wrapper.querySelectorAll('canvas').forEach(canvas => {
        let sibling = canvas.nextElementSibling;
        while (sibling) {
          hide(sibling);
          sibling = sibling.nextElementSibling;
        }
      });
    };

    // Run immediately + after Spline finishes loading
    removeBadge();
    const timers = [100, 500, 1500, 3500].map(ms => setTimeout(removeBadge, ms));

    // Watch for dynamically injected badge nodes
    const observer = new MutationObserver(removeBadge);
    observer.observe(wrapper, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [ref]);
}

export function InteractiveRobotSpline({ scene, className }: InteractiveRobotSplineProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  useHideSplineBadge(wrapperRef);

  return (
    <div ref={wrapperRef} className="relative w-full h-full overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full border-t border-violet-500/50 animate-spin" />
            </div>
          </div>
        }
      >
        <Spline scene={scene} className={className} />
      </Suspense>

      {/* Hard visual cover — sits over the bottom-right corner where Spline injects the badge */}
      <div
        className="absolute bottom-0 right-0 z-50 pointer-events-none"
        style={{ width: 180, height: 52, background: '#020202' }}
      />
    </div>
  );
}
