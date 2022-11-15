const debug = !global.WIDGETS;
if (debug) {
  global.WIDGETS = {};
}

(() => {
  const NAME = "batvp";

  let fakeBattery = 0;
  let fakeCharging = false;

  if (debug) {
    setInterval(() => {
      fakeBattery += 1;
      if (fakeBattery > 100) {
        fakeBattery = 0;
        fakeCharging = !fakeCharging;
      }

      WIDGETS[NAME].draw();
    }, 100);
  }

  const colors = {
    normal: g.theme.fg,
    low: "#F00",
    charge: "#0F0",
    text: "#00F",
  }
  WIDGETS[NAME] = {
    area: "tr",
    width: 12,
    draw() {
      const x = this.x;
      const y = this.y;
      g.reset();
      g.clearRect(x, y, x + 12, y + 24);

      const isCharging = debug ? fakeCharging : Bangle.isCharging();
      g.setColor(isCharging ? colors.charge : colors.normal)
        .fillRect(x + 1, y + 2, x + 11, y + 22)
        .clearRect(x + 2, y + 4, x + 10, y + 21)
        .fillRect(x + 4, y + 1, x + 8, y + 2);

      const battery = debug ? fakeBattery : E.getBattery();
      g.setColor(battery < 10 ? colors.low : colors.charge)
        .fillRect(x + 3, y + 20 - (battery * 15 / 100), x + 9, y + 20);

      if (battery !== 100) {
        battery.toString().split('').forEach((d, i) => {
          g.setColor(battery < 10 ? colors.low : colors.text).setFont("6x8").drawString(d, x + 4, y + 5 + (i * 8));
        });
      }
    }
  };

  Bangle.on('charging', (charging) => {
    if (charging) Bangle.buzz();
    WIDGETS[NAME].draw();
  });

  setInterval(() => WIDGETS[NAME].draw(), 60000);

  Bangle.on('lcdPower', (on) => {
    if (on) WIDGETS[NAME].draw(); // refresh at power on
  });
})();

if (debug) {
  Bangle.drawWidgets();
}
