# Homepage Countdown

The website can run on its own, and the Chrome extension opens the deployed site
inside an extension-owned New Tab page. When opened by the extension, app
`localStorage` is mirrored to `chrome.storage.local`; existing website data is
imported the first time the extension is used.

## Deploy the website

Run `npm run build` and deploy the generated `dist` folder as the website.

## Install the Chrome extension

The extension package is the separate `extension` folder, not `dist`. In
Chrome, open `chrome://extensions`, enable Developer mode, choose **Load
unpacked**, and select `extension`.

The extension iframe currently points to
`https://tunglam7554.github.io/homepage-countdown/` in `extension/newtab.js`.
If the site is deployed at another address, update that URL and the matching
`frame-src` origin in `extension/manifest.json`. Deploy website changes and
reload the extension after changing extension files.
