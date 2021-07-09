const {app, BrowserWindow, TouchBar} = require('electron')
const fs = require('fs')
const path = require('path');
const neatCsv = require('neat-csv');
const {TouchBarButton, TouchBarSpacer} = TouchBar

const SPEED = 1000 * 60 * 5; // 5 minutes
const LANGUAGE = 'chinese'

const character = new TouchBarButton({
  'backgroundColor': '#000',
  'label': '',
})

const pinyin = new TouchBarButton({
  'backgroundColor': '#000',
  'label': '',
  'enabled': false,
})

const translation = new TouchBarButton({
  'backgroundColor': '#000',
  'label': '',
  'enabled': false,
})

const next = new TouchBarButton({
  'backgroundColor': '#000',
  'label': '👉',
  'click': () => {
    setNewEntry()
  }
})

const setNewEntry = () => {
  fs.readFile(path.join(__dirname, `assets/dictionary/${LANGUAGE}.csv`), 'utf8', function (error,data) {
    if (error) {
      console.log(error);

      return;
    }

    (async () => {
      // Read the dictionary csv file
      let items = await neatCsv(data)
      // Filter already selected
      items = items.filter(entry => entry.chinese !== character.label);
      // Get a random entry
      const item = items[Math.floor(Math.random() * items.length)];
      // Set the character and translation
      character.label = item.chinese;
      pinyin.label = item.pinyin;
      translation.label = item.translation;
    })();
  });
}

setNewEntry();
const animate = () => {
  setInterval(setNewEntry, SPEED)
}

const touchBar = new TouchBar({
  items: [
    next,
    character,
    new TouchBarSpacer({ size: 'flexible' }),
    pinyin,
    translation,
  ],
})

app.once('ready', () => {
  let window = new BrowserWindow({
    // frame: false,
    // titleBarStyle: 'hiddenInset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
  animate();
})


app.on('window-all-closed', () => {
  app.quit();
});
