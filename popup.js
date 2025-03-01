const STORAGE_KEY = "stored_urls";

window.onload = async function () {
  await loadUrlsFromStorage();
  setupEventListeners();
};

async function loadUrlsFromStorage() {
  const data = await browser.storage.local.get(STORAGE_KEY);
  if (!data[STORAGE_KEY]) return;

  const parsed = JSON.parse(data[STORAGE_KEY]);

  document.getElementById("urls").value = parsed.join("\n");
}

function setupEventListeners() {
  document.getElementById("store").addEventListener("click", handleStoreClick);
  document.getElementById("closeall").addEventListener("click", closeAllTabs);
  document
    .getElementById("openAndPin")
    .addEventListener("click", handleOpenAndPinClick);
}

async function closeAllTabs() {
  const tabs = await browser.tabs.query({ currentWindow: true });
  const pinnedTabsIds = tabs.filter((tab) => tab.pinned).map((tab) => tab.id);

  browser.tabs.remove(pinnedTabsIds);
}

function handleStoreClick() {
  const urls = getUrlsFromTextArea();
  browser.storage.local.set({ [STORAGE_KEY]: JSON.stringify(urls) });
}

function handleOpenAndPinClick() {
  const urls = getUrlsFromTextArea();

  console.log(urls);
  for (let url of urls) {
    const trimmed = url.trim();
    if (trimmed && isValidURL(trimmed)) {
      browser.tabs.create({ pinned: true, url: trimmed });
    }
  }
}

function getUrlsFromTextArea() {
  const textareaValue = document.getElementById("urls").value;
  return textareaValue.split("\n");
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
