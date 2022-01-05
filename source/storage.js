export const defaults = {
  apiKey: '',
  interval: 5,
};

export const getOptions = async () => chrome.storage.sync.get(defaults);
