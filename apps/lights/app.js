let state = 'splash';
let str = '';

function drawSplash() {
  g.reset().clearRect(Bangle.appRect);
  g.setFont("Vector", 40)
    .setFontAlign(0, 0)
    .drawString('Getting\nLights', g.getWidth() / 2, g.getHeight() / 2);
}

const splash = () => {
  drawSplash();
};

const advertise = () => {
  g.reset().clearRect(Bangle.appRect);
  g.setFont("Vector", 10);
  g.setFontAlign(0, 0);
  g.drawString(`${str}\n${g.wrapString(JSON.stringify(lights), g.getWidth()).join("\n")}`, g.getWidth() / 2, g.getHeight() / 2);
};

Bangle.on('touch', () => {
  NRF.updateServices({
    "985f02d0-babf-4aa2-a9cf-5c7c02e8a731": {
      "985f0003-babf-4aa2-a9cf-5c7c02e8a731": {
        value: [1, 1, 1],
        notify: true,
      }
    }
  });
});

const SERVICE_UUID = "985f02d0-babf-4aa2-a9cf-5c7c02e8a731";
const CHAR_UUID = "985f0001-babf-4aa2-a9cf-5c7c02e8a731";

let lights = [];

const stringFromData = (data) => {
  let res = "";
  for (let i = 0; i < data.length; i += 1) {
    res += String.fromCharCode(data[i]);
  }
  return res;
};

const init = () => {
  NRF.disconnect();
  NRF.setTxPower(4);
  NRF.setServices({
    "985f02d0-babf-4aa2-a9cf-5c7c02e8a731": {
      "985f0001-babf-4aa2-a9cf-5c7c02e8a731": {
        value: [0],
        maxLen: 20,
        writable: true,
        onWrite: function (evt) {
          state = 'advertise';
          str = stringFromData(evt.data);
          str.split(',').forEach((name, i) => {
            if (!lights[i]) {
              lights[i] = {};
            }
            lights[i].name = name;
          });
          advertise();
        }
      },
      "985f0002-babf-4aa2-a9cf-5c7c02e8a731": {
        value: [0, 0, 0],
        writable: true,
        onWrite: function (evt) {
          lights[evt.data[0]].on = evt.data[1];
          lights[evt.data[0]].brightness = evt.data[2];
          draw();
        }
      },
      "985f0003-babf-4aa2-a9cf-5c7c02e8a731": {
        value: [0, 0, 0],
        readable: true,
      },
    }
  }, { advertise: [0xfa57] });
  splash();
};

g.clear();
Bangle.loadWidgets();
Bangle.drawWidgets();

init();
