(() => {
  const allowed = /^(?:[a-z0-9-]+\.)*(?:x\.com|twitter\.com)$/i;
  function clean(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/https:\/\/[^\s<>"']+/gi, candidate => {
      // Keep punctuation surrounding a pasted link intact.
      const match = candidate.match(/^(.*?)([).,;!\]}]*)$/);
      const [, raw, punctuation] = match;
      try {
        const url = new URL(raw);
        if (!allowed.test(url.hostname) || url.port || url.username || url.password) return candidate;
        // Post URLs work without queries; other X routes may need functional parameters.
        if (/^\/(?:[\w]+\/status|i\/web\/status)\/\d+(?:\/(?:photo|video)\/\d+)?\/?$/.test(url.pathname)) {
          if (!url.search) return candidate;
          return raw.slice(0, raw.indexOf('?')) .split('#')[0] + url.hash + punctuation;
        }
        const keys = [...url.searchParams.keys()].filter(k => /^(?:utm_.+|s|t|ref_src|ref_url|twclid)$/i.test(k));
        if (!keys.length) return candidate;
        keys.forEach(k => url.searchParams.delete(k));
        return url.href + punctuation;
      } catch { return candidate; }
    });
  }
  Object.defineProperty(window, '__cleanCopy', {value: clean, configurable: true});
})();
