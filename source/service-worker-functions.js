import { getOptions } from './storage.js';

const BUNPRO_REVIEW_URI = 'https://www.bunpro.jp/study';

// TODO: getMessage() is not supported in MV3: https://github.com/w3c/webextensions/issues/93
// Hardcode these for now...
export const i18n = {
  // contextMenu_checkNow: chrome.i18n.getMessage('contextMenu_checkNow'),
  // badge_error: chrome.i18n.getMessage('badge_error'),
  contextMenu_checkNow: 'Check now',
  badge_error: 'ERR',
};

export const BADGE_COLORS = {
  NORMAL: 'blue',
  WARNING: 'yellow',
  FAILURE: 'red',
};

export const setupAlarm = async (interval) => {
  const alarmId = 'bunpro-checker@brawl345.github.com__alarm';
  const alarm = await chrome.alarms.get(alarmId);

  if (!alarm || alarm.periodInMinutes !== interval) {
    chrome.alarms.create(alarmId, {
      periodInMinutes: interval,
    });
  }
};

export const onInstalled = () => {
  chrome.contextMenus.create({
    id: 'bunpro-checker@brawl345.github.com__action_contextMenu_checkNow',
    title: i18n.contextMenu_checkNow,
    contexts: ['action'],
  });
  checkBunpro();
};

const setBadge = (color, text) => {
  chrome.action.setBadgeBackgroundColor({ color: color });
  chrome.action.setBadgeText({ text: text });
};

export const checkBunpro = async () => {
  const { apiKey } = await getOptions();
  if (apiKey === '') {
    setBadge(BADGE_COLORS.WARNING, '!');
    return;
  }
  const api_url = `https://bunpro.jp/api/user/${apiKey}/study_queue`;

  let body = {};
  try {
    const response = await fetch(api_url);
    body = await response.json();
  } catch (error) {
    console.error(error);
    setBadge(BADGE_COLORS.FAILURE, i18n.badge_error);
    return;
  }

  if (body.errors || !body.requested_information) {
    console.error(body.errors);
    setBadge(BADGE_COLORS.FAILURE, i18n.badge_error);
    return;
  }

  const reviews_available = body.requested_information.reviews_available;
  if (reviews_available > 0) {
    setBadge(BADGE_COLORS.NORMAL, reviews_available.toString());
  } else {
    setBadge(BADGE_COLORS.NORMAL, '');
  }
};

const openBunproReviewPage = () => {
  chrome.tabs.create({ url: BUNPRO_REVIEW_URI });
};

export const onClickIcon = async () => {
  const { apiKey } = await getOptions();

  if (apiKey === '') {
    chrome.runtime.openOptionsPage();
  } else {
    setBadge(BADGE_COLORS.NORMAL, '');
    openBunproReviewPage();
  }
};
