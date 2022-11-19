let bgColor = g.theme.bg;
let fgColor = g.theme.fg;

let times = 1;
let sides = 6;

let state = 'menu';

let result = ''
let rolls = '';

function draw() {
  switch (state) {
    case "menu":
      return drawMenu();
    case 'rolling':
      return drawRolling();
    case 'result':
      return drawResult();
  }
}

function drawMenu() {
  g.setColor(bgColor);
  g.fillRect(0, 24, g.getWidth(), g.getHeight());
  g.setColor(fgColor);
  g.setFontAlign(0, 0);
  g.setFontVector(40);
  g.drawString('d', g.getWidth() / 2, g.getHeight() / 2);
  g.setFontAlign(1, 0);
  g.drawString(times, g.getWidth() / 2 - 15, g.getHeight() / 2);
  g.setFontAlign(-1, 0);
  g.drawString(sides, g.getWidth() / 2 + 15, g.getHeight() / 2);
  drawTriangle(g.getWidth() * .25, g.getHeight() * .5 - 25);
  drawTriangle(g.getWidth() * .25, g.getHeight() * .5 + 25, true);
  drawTriangle(g.getWidth() * .75, g.getHeight() * .5 - 25);
  drawTriangle(g.getWidth() * .75, g.getHeight() * .5 + 25, true);

  g.drawRect(g.getWidth() * .33, g.getHeight() * .78, g.getWidth() * .66, g.getHeight()* .90)
  g.setFontAlign(0, 0);
  g.setFontVector(20);
  g.drawString('Roll', g.getWidth()/2, g.getHeight()*.85);
}

const drawTriangle = (x, y, down) => {
  let size = 8;
  g.fillPoly([x - size, y, x, y - (down ? -size : size), x + size, y]);
}

const drawRolling = () => {
  g.setColor(bgColor);
  g.fillRect(0, 24, g.getWidth(), g.getHeight());
  g.setColor(fgColor);
  g.setFontAlign(0, 0);
  g.setFontVector(40);
  g.drawString('Rolling...', g.getWidth() / 2, g.getHeight() / 2);
};

const drawResult = () => {
  g.setColor(bgColor);
  g.fillRect(0, 24, g.getWidth(), g.getHeight());
  g.setColor(fgColor);
  g.setFontAlign(0, 0);
  g.setFontVector(40);
  g.drawString(result, g.getWidth() / 2, g.getHeight() / 2);
  g.setFontAlign(0, -1);
  g.setFontVector(16);
  g.drawString(g.wrapString(rolls, g.getWidth()*.9).join("\n"), g.getWidth()/2, g.getHeight() * .60);
}

const roll = () => {
  state = 'rolling';
  draw();

  rolls = '';
  result = 0;
  for (let i = 0; i < times; i++) {
    const roll = Math.floor(Math.random() * sides)+1;
    console.log('r', roll);
    if (rolls) {
      rolls += ', ' + roll;
    } else {
      rolls = '' + roll;
    }
    result += roll;
  }

  setTimeout(() => {
    state = 'result';
    draw();
  }, 3000)
};

Bangle.on('touch', (_, e) => {
  if (state === 'menu'
    && e.x >= g.getWidth() * .2
    && e.x <= g.getWidth() * .8
    && e.y >= g.getHeight() * .7
    && e.y <= g.getHeight()) {
    roll();
  } else if (state === 'result') {
    state = 'menu';
    draw();
  }
})

let drag = false;
Bangle.on('drag', (event) => {
  if (state === 'menu' && Math.abs(event.dy) > 10) {
    if (event.x < g.getWidth() * .45) {
      times = Math.max(1, times + (event.dy < 0 ? 1 : -1));
    } else if (event.x > g.getWidth() * .55) {
      let step = 1;
      if (sides > 20 || (sides === 20 && event.dy < 0)) {
        step = 10;
      }
      sides = Math.max(1, sides + (event.dy < 0 ? step : -step));
    }
    draw();
  }
});


g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();

setInterval(() => {
  // keep screen on
  Bangle.setLCDBrightness(.3);
  Bangle.setLCDPower(1);
}, 1000);

draw();
