// Shared dashboard navigation model (deany_navigation_fix_spec.md phase 2).
//
// One source of truth: an active bottom-nav tab plus a stack of OVERLAYS pushed on
// top of it (reader, subject path, tool, core-words). Each overlay records the tab
// it was launched from (its origin) so back returns to exactly there - never a
// section root (rule 1). Deep links push exactly one entry (rule 2). The tab
// highlight follows the top overlay's OWNING section, not the origin (rule 3).
// Overlays are pushed to the browser history so browser/hardware/edge-swipe back
// pop them too (rule 5); the active tab stays mounted underneath so its scroll and
// state survive a back (rule 7). Tab switches never pollute history (rule 8).
import { useState, useRef, useCallback, useEffect } from 'react';

// Section that owns each overlay type, for the tab highlight (rule 3). Types not
// listed highlight their origin tab.
export const OVERLAY_OWNER = { reader: 'quran', corewords: 'quran', path: 'topics' };

export function useDashNav(initialTab = 'home') {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [overlays, setOverlays] = useState([]); // [{ type, originTab, ...params }]
  const tabRef = useRef(activeTab); tabRef.current = activeTab;
  const ovRef = useRef(overlays); ovRef.current = overlays;

  // Browser history: overlay depth is stored on each entry; popstate truncates the
  // overlay stack to that depth, so browser/hardware back maps to in-app back.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { window.history.replaceState({ ...(window.history.state || {}), deanyOv: 0 }, ''); } catch (_) {}
    const onPop = (e) => {
      const target = (e && e.state && typeof e.state.deanyOv === 'number') ? e.state.deanyOv : 0;
      setOverlays((prev) => (prev.length > target ? prev.slice(0, target) : prev));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Push one overlay, recording its origin tab. Exactly one history entry (rule 2).
  const open = useCallback((entry) => {
    setOverlays((prev) => {
      const next = [...prev, { ...entry, originTab: entry.originTab || tabRef.current }];
      try { window.history.pushState({ deanyOv: next.length }, ''); } catch (_) {}
      return next;
    });
  }, []);

  // In-app back with a safe fallback (rule 5): pop the top overlay via history so the
  // browser stack stays in sync; at a tab root there is nothing to pop.
  const goBack = useCallback(() => {
    if (ovRef.current.length > 0) {
      try { window.history.back(); } catch (_) { setOverlays((p) => p.slice(0, -1)); }
    }
  }, []);

  // Complete a flow: drop its overlays and land back on the origin tab with the
  // finished screens removed from history (rule 6), so back never re-enters it.
  const completeFlow = useCallback((originTab) => {
    const depth = ovRef.current.length;
    if (originTab) setActiveTab(originTab);
    setOverlays([]);
    if (depth > 0) { try { window.history.go(-depth); } catch (_) {} }
  }, []);

  // Bottom-nav tap: lateral move, never a history push (rule 8). Tapping the active
  // (highlighted) section pops its overlays to root (rule 4's sanctioned reset).
  const onTapTab = useCallback((tab) => {
    const depth = ovRef.current.length;
    setActiveTab(tab);
    if (depth > 0) { setOverlays([]); try { window.history.go(-depth); } catch (_) {} }
  }, []);

  const top = overlays.length ? overlays[overlays.length - 1] : null;
  const highlightTab = top ? (OVERLAY_OWNER[top.type] || top.originTab) : activeTab;

  return { activeTab, overlays, top, highlightTab, open, goBack, completeFlow, onTapTab, setActiveTab };
}
