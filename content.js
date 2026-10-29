(() => {
  const clean = window.__cleanCopy;
  delete window.__cleanCopy;
  let host, timer;
  function confirm() {
    if (!document.documentElement) return;
    if (!host) {
      host = document.createElement('div');
      const root = host.attachShadow({mode:'closed'});
      root.innerHTML = `<style>:host{all:initial;position:fixed;bottom:26px;left:50%;transform:translate(-50%,8px);z-index:2147483647;pointer-events:none;opacity:0;transition:opacity .16s,transform .16s}:host([visible]){opacity:1;transform:translate(-50%,0)}div{display:flex;align-items:center;gap:9px;padding:11px 16px;border:1px solid #ffffff24;border-radius:100px;background:#151917;color:#f1f5f0;box-shadow:0 6px 28px #0003;font:500 13px system-ui,sans-serif}span{color:#baff9f;font-size:16px}@media(prefers-reduced-motion:reduce){:host{transition:none}}</style><div role="status" aria-live="polite"><span>✓</span> Clean link copied</div>`;
    }
    if (!host.isConnected) document.documentElement.append(host);
    requestAnimationFrame(() => host.setAttribute('visible',''));
    clearTimeout(timer);
    timer = setTimeout(() => host.removeAttribute('visible'), 1700);
  }
  // Transform before the browser writes: no clipboard polling or second write.
  const clipboard = navigator.clipboard;
  if (clipboard?.writeText) {
    const original = clipboard.writeText.bind(clipboard);
    try { Object.defineProperty(clipboard, 'writeText', {configurable:true, value: async function(text) {
      const next = clean(text);
      await original(next);
      if (next !== text) confirm();
    }}); } catch { /* Native copy events below remain available. */ }
  }
  // Covers legacy execCommand('copy'), selected text and event-supplied text.
  const nativeSetData = DataTransfer.prototype.setData;
  let copyEvent = null;
  let changed = false;
  DataTransfer.prototype.setData = function(type, value) {
    const next = copyEvent && this === copyEvent.clipboardData && /^(?:text|text\/plain)$/i.test(type) ? clean(value) : value;
    const result = nativeSetData.call(this, type, next);
    if (next !== value) changed = true;
    return result;
  };
  window.addEventListener('copy', event => {
    copyEvent = event;
    changed = false;
    // Defer until site copy handlers finish, still within copy-event dispatch.
    document.addEventListener('copy', function finish(e) {
      if (e !== event) return;
      const supplied = e.clipboardData?.getData('text/plain');
      const active = document.activeElement;
      const selection = active && /^(INPUT|TEXTAREA)$/.test(active.tagName) && typeof active.selectionStart === 'number'
        ? active.value.slice(active.selectionStart, active.selectionEnd) : window.getSelection()?.toString();
      const source = supplied || (!e.defaultPrevented ? selection : '');
      const next = clean(source);
      if (source && next !== source && e.clipboardData) {
        nativeSetData.call(e.clipboardData, 'text/plain', next);
        e.clipboardData.clearData('text/html');
        e.preventDefault();
        changed = true;
      }
      if (changed && e.defaultPrevented) confirm();
    }, {once:true});
    queueMicrotask(() => {copyEvent = null;});
  }, true);
})();
