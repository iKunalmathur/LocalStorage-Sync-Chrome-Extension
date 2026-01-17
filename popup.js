const syncBtn = document.getElementById('syncBtn');
const statusDiv = document.getElementById('status');
const settingsToggle = document.getElementById('settingsToggle');
const settingsContent = document.getElementById('settingsContent');
const devHostInput = document.getElementById('devHost');
const localhostHostInput = document.getElementById('localhostHost');
const tokenKeyInput = document.getElementById('tokenKey');
const saveBtn = document.getElementById('saveBtn');

// Current settings
let currentDevHost = '';
let currentLocalhostHost = '';
let currentTokenKey = 'access_token';

function showStatus(message, type = 'success') {
  statusDiv.textContent = message;
  statusDiv.className = `status ${type}`;
  setTimeout(() => {
    statusDiv.className = 'status';
  }, 4000);
}

function setLoading(isLoading) {
  syncBtn.disabled = isLoading;
  if (isLoading) {
    syncBtn.innerHTML = '<span class="spinner"></span>Syncing...';
  } else {
    syncBtn.innerHTML = 'Sync Token Now';
  }
}

async function getTokenFromDevTab() {
  const devPattern = currentDevHost + '/*';
  const devTabs = await chrome.tabs.query({ url: devPattern });
  if (!devTabs.length) {
    throw new Error("No Dev tab open. Please open " + currentDevHost);
  }

  const [result] = await chrome.scripting.executeScript({
    target: { tabId: devTabs[0].id },
    func: (key) => localStorage.getItem(key),
    args: [currentTokenKey]
  });

  const token = result?.result;
  if (!token) {
    throw new Error(`Token not found for key "${currentTokenKey}"`);
  }
  return token;
}

async function setTokenOnLocalhost(token) {
  const localhostPattern = 'http://localhost:*/*';
  let localTabs = await chrome.tabs.query({ url: localhostPattern });

  if (!localTabs.length) {
    const targetUrl = currentLocalhostHost || 'http://localhost:3000';
    const tab = await chrome.tabs.create({ url: targetUrl });
    localTabs = [tab];
    await new Promise((r) => setTimeout(r, 800));
  }

  await chrome.scripting.executeScript({
    target: { tabId: localTabs[0].id },
    func: (key, value) => {
      localStorage.setItem(key, value);
      location.reload();
    },
    args: [currentTokenKey, token]
  });
}

// Load saved settings on popup open
async function loadSettings() {
  const result = await chrome.storage.sync.get(['devHost', 'localhostHost', 'tokenKey']);
  currentDevHost = result.devHost || '';
  currentLocalhostHost = result.localhostHost || '';
  currentTokenKey = result.tokenKey || 'access_token';
  
  devHostInput.value = currentDevHost;
  localhostHostInput.value = currentLocalhostHost;
  tokenKeyInput.value = currentTokenKey;
}

// Save settings
saveBtn.addEventListener('click', async () => {
  const devHost = devHostInput.value.trim();
  const localhostHost = localhostHostInput.value.trim();
  const tokenKey = tokenKeyInput.value.trim();
  
  if (!devHost || !tokenKey) {
    showStatus('✗ Dev URL and token key are required', 'error');
    return;
  }
  
  // Validate URLs
  try {
    new URL(devHost);
    if (localhostHost) {
      new URL(localhostHost);
    }
  } catch (e) {
    showStatus('✗ Invalid URL format', 'error');
    return;
  }
  
  await chrome.storage.sync.set({ devHost, localhostHost, tokenKey });
  currentDevHost = devHost;
  currentLocalhostHost = localhostHost;
  currentTokenKey = tokenKey;
  showStatus('✓ Settings saved!', 'success');
});

// Toggle settings panel
settingsToggle.addEventListener('click', () => {
  settingsContent.classList.toggle('open');
  settingsToggle.querySelector('.toggle-icon').classList.toggle('open');
});

// Sync button
syncBtn.addEventListener('click', async () => {
  try {
    setLoading(true);
    const token = await getTokenFromDevTab();
    await setTokenOnLocalhost(token);
    showStatus('✓ Token synced successfully!', 'success');
  } catch (error) {
    showStatus('✗ ' + error.message, 'error');
  } finally {
    setLoading(false);
  }
});

// Initialize
loadSettings();
