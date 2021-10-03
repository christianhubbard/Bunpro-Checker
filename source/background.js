'use strict';

const bunproChecker = () => {
  const BUNPRO_REVIEW_URI = 'https://www.bunpro.jp/study';

  // TODO: getMessage() is not supported in MV3: https://github.com/w3c/webextensions/issues/93
  // Hardcode these for now...
  const i18n = {
    // contextMenu_checkNow: chrome.i18n.getMessage('contextMenu_checkNow'),
    // badge_error: chrome.i18n.getMessage('badge_error'),
    contextMenu_checkNow: 'Check now',
    badge_error: 'ERR'
  };

  const BADGE_COLORS = {
    NORMAL: 'blue',
    WARNING: 'yellow',
    FAILURE: 'red',
  };

  const OPTIONS = {
    api_key: '',
    interval: 5.0,
  };

  const loadOptions = async () => {
    const userOptions = await chrome.storage.sync.get(OPTIONS);

    for (const key in userOptions) {
      OPTIONS[key] = userOptions[key];
    }
  };

  const setBadge = (color, text) => {
    chrome.action.setBadgeBackgroundColor({color: color});
    chrome.action.setBadgeText({text: text});
  };

  const checkBunpro = async function () {
    const api_url = `https://bunpro.jp/api/user/${OPTIONS.api_key}/study_queue`;

    let body = {};
    try {
      const response = await fetch(api_url);
      body = await response.json();
    } catch (err) {
      setBadge(BADGE_COLORS.FAILURE, i18n.badge_error);
      return;
    }

    if (body.errors || !body.requested_information) {
      console.log(body.errors);
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

  const openBunproReviewPage = async () => {
    chrome.tabs.create({url: BUNPRO_REVIEW_URI});
  };

  const onClickIcon = async () => {
    if (OPTIONS.api_key === '') {
      chrome.runtime.openOptionsPage();
    } else {
      setBadge(BADGE_COLORS.NORMAL, '');
      openBunproReviewPage();
    }
  };

  const setup = async () => {
    await checkBunpro();
    chrome.alarms.create('bunpro-checker@brawl345.github.com__alarm', {
      periodInMinutes: OPTIONS.interval,
    });

    await chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
      id: 'bunpro-checker@brawl345.github.com__action_contextMenu_checkNow',
      title: i18n.contextMenu_checkNow,
      contexts: ['action'],
    });
  };

  const handleInitMessage = async (request) => {
    if (request !== 'init') {
      return;
    }
    setBadge(BADGE_COLORS.NORMAL, '');

    await loadOptions();
    if (OPTIONS.url === '') {
      setBadge(BADGE_COLORS.WARNING, '!');
    } else {
      setup();
    }
  };

  const init = async () => {
    setBadge(BADGE_COLORS.NORMAL, '');
    await loadOptions();

    chrome.alarms.onAlarm.addListener(checkBunpro);
    chrome.action.onClicked.addListener(onClickIcon);
    chrome.contextMenus.onClicked.addListener(checkBunpro);
    chrome.runtime.onMessage.addListener(handleInitMessage);

    if (OPTIONS.api_key === '') {
      setBadge(BADGE_COLORS.WARNING, '!');
    } else {
      setup();
    }
  };

  return init();
};

bunproChecker();

