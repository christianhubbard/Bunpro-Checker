# Bunpro Checker

Bunpro Checker is a WebExtension that tracks pending reviews on [Bunpro.jp](https://www.bunpro.jp) and shows a badge
with the number of reviews that still need to be done.

## Setup

1. Install the extension: [Chrome Web Store](https://chrome.google.com/webstore/detail/kdmajdephakcakeldepipjhdabgccoja), [Microsoft Edge Add-Ons](https://microsoftedge.microsoft.com/addons/detail/bunpro-checker/pidjoaoepkdbipppfldfbbellceokjbp)
2. Open the extension's preferences page from the extensions manager and set
   your [Bunpro API key](https://www.bunpro.jp/settings/api). Make the toolbar icon visible if you want to see the
   number of unread items.

## Build

1. Clone
2. Install dependencies with `npm ci`
3. Run `npm run dev` for bundling the JS
4. Run `npm run start:chrome` for starting the browser with the extension pre-loaded and ready for debugging with
   hot-reloading
5. Build with `npm run build`

Primary development target is Chrome. Firefox is not supported due to lack of Manifest v3 - you can
use [Bunpro Alerts](https://addons.mozilla.org/firefox/addon/bunpro-alerts/) by i_Jedi.

## Usage notes

- Clicking the toolbar icon opens the Bunpro review page
- Right-clicking it and choosing "Check now" forces the badge to update
- The time between checks can be set in the preferences (minimum of two minutes since there is a rate-limit of 40 per
  minute).
- The API key is stored in the extension's sync storage, effectively in clear text on the file system and in your sync account.
