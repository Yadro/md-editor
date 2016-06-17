
var SimpleMDE = require('simplemde');

new SimpleMDE({
  element: document.getElementById("editor"),
  spellChecker: false,
  autoDownloadFontAwesome: false
});