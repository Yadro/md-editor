/// <reference path="globals/chrome/index.d.ts" />

chrome.app.runtime.onLaunched.addListener(function() {
  var window = chrome.app.window.create('index.html', {
    id: 'main',
    bounds: { width: 620, height: 500 },
    innerBounds: { minWidth: 300, minHeight: 300 }
  });

});