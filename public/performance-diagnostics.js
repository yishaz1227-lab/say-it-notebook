// Opt-in, local-only timing panel. No requests, analytics, or persisted data.
(function () {
  const render = () => {
    let panel = document.getElementById('sayit-performance');
    if (!panel) {
      panel = document.createElement('pre');
      panel.id = 'sayit-performance';
      panel.setAttribute('role', 'status');
      panel.style.cssText = 'position:fixed;z-index:2147483647;bottom:8px;left:8px;right:8px;max-height:45vh;overflow:auto;padding:12px;background:#fff;color:#111;border:2px solid #555;font:13px/1.5 monospace;white-space:pre-wrap;pointer-events:none';
      document.body.appendChild(panel);
    }
    const nav = performance.getEntriesByType('navigation')[0];
    const interactive = performance.getEntriesByName('sayit-interactive')[0];
    const sec = v => Math.round(v) + ' ms';
    const resources = performance.getEntriesByType('resource').filter(r => ['script','css','link'].includes(r.initiatorType)).map(r => ({file:new URL(r.name).pathname.split('/').pop(),start:sec(r.startTime),end:sec(r.responseEnd),duration:sec(r.duration),bytes:r.transferSize}));
    panel.textContent = JSON.stringify({documentResponse:nav ? sec(nav.responseStart) : null,documentFinished:nav ? sec(nav.responseEnd) : null,domReady:nav ? sec(nav.domContentLoadedEventEnd) : null,firstPaint:performance.getEntriesByName('first-contentful-paint').map(p=>sec(p.startTime)),appInteractive:interactive ? sec(interactive.startTime) : 'pending',resources},null,2);
  };
  let runs=0;const interval=setInterval(()=>{render();if(++runs>=20)clearInterval(interval)},500);
})();
