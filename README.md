# Clean Copy — for X

A small Chrome extension with a charcoal popup, lime accents, and a quiet checkmark toast.

## Install

1. Extract the ZIP and keep the `clean-copy` folder somewhere permanent.
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** in the top-right corner.
4. Click **Load unpacked** and select the `clean-copy` folder containing `manifest.json`.
5. Refresh any open X or Twitter tabs. Copy a post link using X's **Copy link** action.

Paste the result to check it. For example:

`https://x.com/person/status/123?s=46&t=example`

becomes:

`https://x.com/person/status/123`

A small **✓ Clean link copied** message appears only after a link changes. Pin the extension to view its popup.

## Scope and privacy

- Runs only on HTTPS X and Twitter pages and their subdomains.
- Removes query parameters from recognized post links, preserving photo/video paths and fragments.
- Other X URLs retain functional parameters, such as search queries. Only known sharing/tracking parameters are removed there.
- Handles X's `navigator.clipboard.writeText` flow and ordinary copy events. Links inside copied plain text are cleaned too.
- No clipboard reading permission, polling, accounts, logs, analytics, remote code, or network requests.
- Does not alter copies from the browser address bar, browser context-menu commands, other apps, or other websites. Those actions are outside page copy events.
- Uses Chrome Manifest V3; Chrome 111 or later.

## Verification

Automated checks passed for URL cleaning, domain boundaries, functional query preservation, clipboard write success and failure, selected-text copy, and site-supplied copy data. The user confirmed the extension works in a live X session. Website changes or a different clipboard API may require updates.

Run automated checks with `npm test` (no dependencies required).

## Files

`manifest.json` defines site access. `cleaner.js` contains URL rules. `content.js` handles copying and the confirmation. `popup.html` and `popup.css` provide the toolbar popup. `icons/` contains extension icons.

Chrome content-script reference: https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
