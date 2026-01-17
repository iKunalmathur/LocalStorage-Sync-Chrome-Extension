# Token Sync Extension

This extension copies your access token from the Dev environment's `localStorage` and writes it to `localhost` under the same key, then reloads localhost so your app works without manual copy/paste.

## Configure
Edit `background.js`:
- `devHostPattern`: Set to match your Dev origin, e.g. `https://dev.example.com/*`
- `localhostPattern`: Defaults to `http://localhost:*/*` (works for any port)
- `localStorageKey`: The key your app uses (e.g. `access_token`)

## Install (Chrome/Edge)
1. Go to `chrome://extensions` (or `edge://extensions`)
2. Enable "Developer mode"
3. Click "Load unpacked" and select the folder containing these files
4. Pin the extension

## Use
1. Open your Dev app and ensure you're logged in (token present in localStorage)
2. Open or ensure localhost is running (e.g., `http://localhost:3000`)
3. Click the extension icon:
   - It reads the token from Dev tab
   - Writes it into localhost's localStorage with the same key
   - Reloads localhost automatically

## Notes
- No code changes to your app required.
- Works with any port on localhost.
- If Dev and localhost use different keys, update `localStorageKey`.

## Troubleshooting
- "No Dev tab open": Open your Dev app URL that matches `devHostPattern`.
- "Token not found": Confirm the key and that you're logged in; verify in DevTools > Application > Local Storage.
- If your Dev site uses a different subdomain/path, update `devHostPattern`.