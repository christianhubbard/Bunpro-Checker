'use strict';

const bunproCheckerOptions = () => {

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
    api_key: document.getElementById('api_key'),
    interval: document.getElementById('interval'),
    save: document.getElementById('save'),
    message: document.getElementById('message'),
  };

  const OPTIONS = {
    api_key: '',
    interval: 5.0,
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
    const userOptions = await chrome.storage.sync.get(OPTIONS);
    for (const key in userOptions) {
      const htmlElement = document.getElementsByName(key)[0];
      if (htmlElement.type === 'checkbox') {
        htmlElement.checked = userOptions[key];
      } else {
        htmlElement.value = userOptions[key];
      }
    }
  };

  const localize = () => {
    document.title = i18n.title;
    HTML.title.textContent = i18n.extensionName;

    HTML.api_key.previousElementSibling.textContent = i18n.apikeyLabel;
    HTML.api_key.placeholder = i18n.apikeyPlaceholder;
    HTML.interval.previousSibling.textContent = i18n.intervalLabel;
    HTML.interval.placeholder = i18n.intervalPlaceholder;

    HTML.save.textContent = i18n.save;
  };

  const saveOptions = async (event) => {
    event.preventDefault();
    const userOptions = {};
    Object.assign(userOptions, OPTIONS);

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

    chrome.storage.sync.set(userOptions)
      .then(() => {
        setMessage('success', i18n.saveSuccess);
        chrome.runtime.sendMessage('init');
      })
      .catch(() => setMessage('failure', i18n.saveFail));
  };
    
  const init = async () => {
    localize();
    restoreOptions();
    document.addEventListener('submit', saveOptions);
  };

  return init();
};


document.addEventListener('DOMContentLoaded', () => bunproCheckerOptions());
