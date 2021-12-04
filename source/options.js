import { defaults, getOptions } from './storage.js';

const i18n = {
  title: chrome.i18n.getMessage('options_title'),
  extensionName: chrome.i18n.getMessage('extensionName'),
  apikeyLabel: chrome.i18n.getMessage('options_bunproApiKeyLabel'),
  apikeyPlaceholder: chrome.i18n.getMessage('options_bunproApiKeyPlaceholder'),
  intervalLabel: chrome.i18n.getMessage('options_intervalLabel'),
  intervalPlaceholder: chrome.i18n.getMessage('options_intervalPlaceholder'),
  save: chrome.i18n.getMessage('options_save'),
  saveSuccess: chrome.i18n.getMessage('options_saveSuccess'),
  saveFail: chrome.i18n.getMessage('options_saveFail'),
};

const HTML = {
  title: document.getElementById('title'),
  apiKey: document.getElementById('apiKey'),
  interval: document.getElementById('interval'),
  save: document.getElementById('save'),
  message: document.getElementById('message'),
};

const clearMessage = () => {
  HTML.message.style.display = 'none';
  HTML.message.className = '';
};

const setMessage = (variant, text) => {
  HTML.message.textContent = text;
  HTML.message.className = variant;
  HTML.message.style.display = 'block';
  setTimeout(clearMessage, 2000);
};

const restoreOptions = async () => {
  const userOptions = await getOptions();
  for (const key in userOptions) {
    const htmlElement = document.getElementsByName(key)[0];
    if (htmlElement.type === 'checkbox') {
      htmlElement.checked = userOptions[key];
    } else {
      htmlElement.value = userOptions[key];
    }
  }
};

const saveOptions = async (event) => {
  event.preventDefault();
  const userOptions = {};
  Object.assign(userOptions, defaults);

  for (const key in userOptions) {
    const htmlElement = document.getElementsByName(key)[0];

    switch (htmlElement.type) {
      case 'checkbox':
        userOptions[key] = htmlElement.checked;
        break;
      case 'number':
        userOptions[key] = parseInt(htmlElement.value);
        break;
      default:
        userOptions[key] = htmlElement.value;
    }
  }

  try {
    await chrome.storage.sync.set(userOptions);
    setMessage('success', i18n.saveSuccess);
  } catch (err) {
    setMessage('failure', i18n.saveFail);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Localize
  document.title = i18n.title;
  HTML.title.textContent = i18n.extensionName;

  HTML.apiKey.previousElementSibling.textContent = i18n.apikeyLabel;
  HTML.apiKey.placeholder = i18n.apikeyPlaceholder;
  HTML.interval.previousSibling.textContent = i18n.intervalLabel;
  HTML.interval.placeholder = i18n.intervalPlaceholder;

  HTML.save.textContent = i18n.save;

  restoreOptions();

  document.addEventListener('submit', saveOptions);
});
