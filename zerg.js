const {app, BrowserWindow, TouchBar, nativeImage} = require('electron')
const path = require('path');
const {TouchBarButton} = TouchBar

// Settings
const DIRECTORY = 'hydralisk';
const TOTAL_FRAMES = 5; // If 5.png is the last, use 5;
const CHARACTER_AMOUNT = 8; // The amount of characters you want displayed (max 8)
const SPEED = 100;

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
    width: 32,
    height: 32,
  })
}

const characters = new Array(CHARACTER_AMOUNT).fill(null).map(() => createCharacter(frame));

const animateFrames = () => {
  if (frame === TOTAL_FRAMES) {
    frame = 0;
  } else {
    frame++;
  }
  characters.map(character => character.icon = createImage(frame));
}

const animate = () => {
  setInterval(animateFrames, SPEED)
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
