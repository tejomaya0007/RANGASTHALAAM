const onecolor = one.color;

function hex2vector(cssHex) {
  const pc = onecolor(cssHex);
  return vec3.fromValues(pc.red(), pc.green(), pc.blue());
}

const charW = 6;
const charH = 10;
const bufferCW = 80;
const bufferCH = 24;
const bufferW = bufferCW * charW;
const bufferH = bufferCH * charH;
const textureW = 512;
const textureH = 256;
const consolePad = 8;
const consoleW = bufferW + consolePad * 2;
const consoleH = bufferH + consolePad * 2;

const bufferCanvas = document.createElement('canvas');
bufferCanvas.width = bufferW;
bufferCanvas.height = bufferH;
const bufferContext = bufferCanvas.getContext('2d');
bufferContext.fillStyle = '#000';
bufferContext.fillRect(0, 0, bufferW, bufferH);

const characterSet = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x30 + i))
  .concat(Array.from({ length: 26 }, (_, i) => String.fromCharCode(0x41 + i)))
  .concat(Array.from({ length: 95 }, (_, i) => String.fromCharCode(0x20 + i)));

const trails = Array.from({ length: 30 }, () => createTrail());

function createTrail() {
  return [Math.floor(Math.random() * bufferCW), 0, 5 + Math.random() * 15];
}

function updateWorld(delta) {
  trails.forEach((trail, i) => {
    trail[1] += trail[2] * delta;
    if (trail[1] > bufferCH) trails[i] = createTrail();
  });
}

function renderWorld(delta) {
  bufferContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
  bufferContext.fillRect(0, 0, bufferW, bufferH);

  bufferContext.textAlign = 'center';
  bufferContext.font = '12px Inconsolata';
  trails.forEach(trail => {
    const char = characterSet[Math.floor(Math.random() * characterSet.length)];
    bufferContext.fillStyle = 'hsl(180, 100%, 60%)';
    bufferContext.fillText(char, (trail[0] + 0.5) * charW, trail[1] * charH + charH);
  });
}

const regl = createREGL({
  canvas: document.querySelector('canvas'),
  attributes: { antialias: true, alpha: false, preserveDrawingBuffer: true }
});

const spriteTexture = regl.texture({ width: textureW, height: textureH, mag: 'linear' });
const termFgColor = hex2vector('#fee');
const termBgColor = hex2vector('#002a2a');

const quadCommand = regl({
  vert: `precision mediump float;
    attribute vec3 position;
    varying vec2 uvPosition;
    void main() {
      uvPosition = position.xy * vec2(0.5, -0.5) + vec2(0.5);
      gl_Position = vec4(position, 1.0);
    }`,
  frag: `precision mediump float;
    varying vec2 uvPosition;
    uniform sampler2D sprite;
    uniform vec3 bgColor, fgColor;
    void main() {
      vec4 sourcePixel = texture2D(sprite, uvPosition);
      gl_FragColor = vec4(mix(bgColor, fgColor, sourcePixel.r), 1.0);
    }`,
  attributes: { position: regl.buffer([[-1, -1, 0], [1, -1, 0], [-1, 1, 0], [1, 1, 0]]) },
  uniforms: { sprite: spriteTexture, bgColor: termBgColor, fgColor: termFgColor },
  primitive: 'triangle strip',
  count: 4,
  blend: { enable: true, func: { src: 'src alpha', dst: 'one minus src alpha' } }
});

function loop() {
  updateWorld(0.05);
  renderWorld(0.05);
  regl.poll();
  spriteTexture.subimage(bufferContext, consolePad, consolePad);
  quadCommand();
  requestAnimationFrame(loop);
}

loop();
