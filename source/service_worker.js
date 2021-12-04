import {
  checkBunpro,
  onClickIcon,
  onInstalled,
  setupAlarm,
} from './service_worker_functions.js';
import { getOptions } from './storage.js';

chrome.runtime.onInstalled.addListener(onInstalled);
chrome.runtime.onStartup.addListener(checkBunpro);
chrome.alarms.onAlarm.addListener(checkBunpro);
chrome.action.onClicked.addListener(onClickIcon);
chrome.contextMenus.onClicked.addListener(checkBunpro);
chrome.storage.sync.onChanged.addListener(({ apiKey, interval }) => {
  if (interval) {
    setupAlarm(interval.newValue);
  }
  if (apiKey) {
    checkBunpro();
  }
});

getOptions().then(({ apiKey, interval }) => {
  if (apiKey !== '') {
    setupAlarm(interval);
  }
});
