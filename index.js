const {app, BrowserWindow, TouchBar, nativeImage} = require('electron')
const path = require('path');
const {TouchBarButton} = TouchBar

// Settings
const MAX_IMAGE = 5; // 21;
const CHARACTER_AMOUNT = 8; // Max 8
const DIRECTORY = 'hydralisk';

let frame = 0;
const createCharacter = (frame) => {
  return new TouchBarButton({
    'backgroundColor': '#000',
    'icon': createImage(frame),
    'iconPosition': 'center',
  })
}

const createImage = () => {
  return nativeImage.createFromPath(path.join(__dirname, `assets/character/${DIRECTORY}/${frame}.png`)).resize({
    width: 16,
    height: 16,
  })
}

const characters = new Array(CHARACTER_AMOUNT).fill(null).map(() => createCharacter(frame));

const animateFrames = () => {
  if (frame === MAX_IMAGE) {
    frame = 0;
  } else {
    frame++;
  }
  characters.map(character => character.icon = createImage(frame));
}

const animate = () => {
  setInterval(animateFrames, 30)
};

const touchBar = new TouchBar({
  items: characters,
})

let window;

app.once('ready', () => {
  window = new BrowserWindow({
    // frame: false,
    // titleBarStyle: 'hiddenInset',
    width: 200,
    height: 200,
    backgroundColor: '#000'
  })
  window.loadURL('about:blank')
  window.setTouchBar(touchBar)
  animate()
})


app.on('window-all-closed', () => {
  app.quit();
});
