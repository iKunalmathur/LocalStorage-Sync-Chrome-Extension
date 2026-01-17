# LocalSync Extension

This extension copies localStorage data from a source environment and writes it to a target environment under the same key, then reloads the target page.

## Configure
Click the settings (⚙️) button in the popup:
- **Source Environment URL**: The URL where you want to read localStorage from (e.g., `https://dev.example.com`)
- **Target Environment URL**: The URL where you want to write localStorage to (e.g., `http://localhost:3000`) - optional, defaults to `http://localhost:3000`
- **localStorage Key**: The key to sync (e.g., `access_token`)

## Install (Chrome/Edge)
1. Go to `chrome://extensions` (or `edge://extensions`)
2. Enable "Developer mode"
3. Click "Load unpacked" and select the folder containing these files
4. Pin the extension

## Use
1. Open your source environment and ensure the data is in localStorage
2. Open or ensure target environment is running
3. Click the extension icon:
   - It reads the data from source tab
   - Writes it into target's localStorage with the same key
   - Reloads target automatically

## Notes
- Works with any localStorage key-value pair
- Supports any source and target URLs
- All settings are saved and persist across browser sessions

## Troubleshooting
- "No source tab open": Open your source environment URL in a browser tab
- "Data not found": Confirm the key exists in localStorage; verify in DevTools > Application > Local Storage
- Update source/target URLs in settings if needed