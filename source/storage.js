export const defaults = {
  apiKey: '',
  interval: 5,
};

export const getOptions = async () => {
  return chrome.storage.sync.get(defaults);
};