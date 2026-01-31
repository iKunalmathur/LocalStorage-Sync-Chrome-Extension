# LocalSync Extension

This extension copies localStorage data from a source environment and writes it to a target environment under the same key, then reloads the target page.

## Browser Support

This extension is available for both Chrome/Edge and Firefox browsers.

## Configure
Click the settings (⚙️) button in the popup:
- **Source Environment URL**: The URL where you want to read localStorage from (e.g., `https://dev.example.com`)
- **Target Environment URL**: The URL where you want to write localStorage to (e.g., `http://localhost:3000`) - optional, defaults to `http://localhost:3000`
- **localStorage Key**: The key to sync (e.g., `access_token`)

## Installation

### Chrome/Edge
1. Go to `chrome://extensions` (or `edge://extensions`)
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome/` folder
4. Pin the extension

### Firefox

#### Temporary Installation (for testing)
1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on..."
4. Navigate to the `firefox/` folder and select `manifest.json`
5. The extension will load temporarily until you restart Firefox

#### Permanent Installation (for development)
Package the extension as an `.xpi` file or sign it with Mozilla and submit to [Mozilla Add-ons](https://addons.mozilla.org/) for review and distribution.

## Usage
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

## Browser-Specific Differences

### Chrome/Edge (`chrome/` folder)
- Uses `chrome` API
- Manifest V3 with service worker

### Firefox (`firefox/` folder)
- Uses `browser` API
- Manifest includes `browser_specific_settings` section
- Uses background scripts instead of service worker
- Requires Firefox 109 or later

## Troubleshooting

### General
- **"No source tab open"**: Open your source environment URL in a browser tab
- **"Data not found"**: Confirm the key exists in localStorage; verify in DevTools > Application > Local Storage
- Update source/target URLs in settings if needed

### Firefox-Specific
- **"about:debugging" shows error**: Ensure Firefox is version 109+
- **Extension not loading**: Check browser console (Ctrl+Shift+K) for errors
- **Sync fails**: Ensure both source and target tabs are open and URLs are correct