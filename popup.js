function getUrlsFromTextArea() {
  const textareaValue = document.getElementById('urls').value;
  const urls = textareaValue.split('\n');
  return urls
}

function storeUrls(urls) {
  chrome.storage.sync.set({ 'storedUrls': urls });
}

window.onload = function () {
  chrome.storage.sync.get("storedUrls", function (data) {
    if (data.storedUrls) {
      document.getElementById("urls").value = data.storedUrls.join("\n");
    }
  });
};

document.getElementById('store').addEventListener('click', function () {
  const urls = getUrlsFromTextArea()
  storeUrls(urls)
})

document.getElementById('openAndPin').addEventListener('click', function () {
  const urls = getUrlsFromTextArea()

  for (let url of urls) {
    // Check if the URL is valid.
    if (url.trim() && isValidURL(url.trim())) {
      chrome.tabs.create({ url: url.trim(), pinned: true });
    }
  }

  // Close the popup after the action.
  window.close();
});

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
