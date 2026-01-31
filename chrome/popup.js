const syncBtn = document.getElementById('syncBtn');
const statusDiv = document.getElementById('status');
const settingsToggle = document.getElementById('settingsToggle');
const settingsContent = document.getElementById('settingsContent');
const sourceHostInput = document.getElementById('sourceHost');
const targetHostInput = document.getElementById('targetHost');
const storageKeyInput = document.getElementById('storageKey');
const saveBtn = document.getElementById('saveBtn');

// Current settings
let currentSourceHost = '';
let currentTargetHost = '';
let currentStorageKey = 'access_token';

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
      syncBtn.innerHTML = 'Sync Now';
  }
}

async function getDataFromSource() {
    const sourcePattern = currentSourceHost + '/*';
    const sourceTabs = await chrome.tabs.query({ url: sourcePattern });
    if (!sourceTabs.length) {
        throw new Error("No source tab open. Please open " + currentSourceHost);
  }

  const [result] = await chrome.scripting.executeScript({
      target: { tabId: sourceTabs[0].id },
    func: (key) => localStorage.getItem(key),
      args: [currentStorageKey]
  });

    const data = result?.result;
    if (!data) {
        throw new Error(`Data not found for key "${currentStorageKey}"`);
  }
    return data;
}

async function setDataOnTarget(data) {
    const targetPattern = 'http://localhost:*/*';
    let targetTabs = await chrome.tabs.query({ url: targetPattern });

    if (!targetTabs.length) {
        const targetUrl = currentTargetHost || 'http://localhost:3000';
    const tab = await chrome.tabs.create({ url: targetUrl });
      targetTabs = [tab];
    await new Promise((r) => setTimeout(r, 800));
  }

  await chrome.scripting.executeScript({
      target: { tabId: targetTabs[0].id },
    func: (key, value) => {
      localStorage.setItem(key, value);
      location.reload();
    },
      args: [currentStorageKey, data]
  });
}

// Load saved settings on popup open
async function loadSettings() {
    const result = await chrome.storage.sync.get(['sourceHost', 'targetHost', 'storageKey']);
    currentSourceHost = result.sourceHost || '';
    currentTargetHost = result.targetHost || '';
    currentStorageKey = result.storageKey || 'access_token';
  
    sourceHostInput.value = currentSourceHost;
    targetHostInput.value = currentTargetHost;
    storageKeyInput.value = currentStorageKey;
}

// Save settings
saveBtn.addEventListener('click', async () => {
    const sourceHost = sourceHostInput.value.trim();
    const targetHost = targetHostInput.value.trim();
    const storageKey = storageKeyInput.value.trim();
  
    if (!sourceHost || !storageKey) {
        showStatus('✗ Source URL and storage key are required', 'error');
    return;
  }
  
  // Validate URLs
  try {
      new URL(sourceHost);
      if (targetHost) {
          new URL(targetHost);
    }
  } catch (e) {
    showStatus('✗ Invalid URL format', 'error');
    return;
  }
  
    await chrome.storage.sync.set({ sourceHost, targetHost, storageKey });
    currentSourceHost = sourceHost;
    currentTargetHost = targetHost;
    currentStorageKey = storageKey;
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
      const data = await getDataFromSource();
      await setDataOnTarget(data);
      showStatus('✓ Storage synced successfully!', 'success');
  } catch (error) {
    showStatus('✗ ' + error.message, 'error');
  } finally {
    setLoading(false);
  }
});

// Initialize
loadSettings();
