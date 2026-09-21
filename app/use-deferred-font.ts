'use client';
import {useEffect} from 'react';

// Typography is progressive enhancement, never a prerequisite for opening a diary.
export function useDeferredFont() {
  useEffect(() => {
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean; effectiveType?: string}}).connection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType ?? '')) return;
    let link: HTMLLinkElement | undefined;
    let deadline: ReturnType<typeof setTimeout> | undefined;
    // Start only after the app has mounted and had time to paint and accept input.
    const start = setTimeout(() => {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.media = 'print'; // The download cannot block screen rendering.
      link.href = 'https://ik.imagekit.io/chinesefonts7/packages/hwmct/dist/%E6%B1%87%E6%96%87%E6%98%8E%E6%9C%9D%E4%BD%93/result.css';
      link.onload = () => {
        clearTimeout(deadline);
        if (link) link.media = 'all'; // Source font uses font-display: swap.
      };
      link.onerror = () => { clearTimeout(deadline); link?.remove(); };
      deadline = setTimeout(() => link?.remove(), 8000);
      document.head.appendChild(link);
    }, 1500);
    return () => { clearTimeout(start); clearTimeout(deadline); link?.remove(); };
  }, []);
}
