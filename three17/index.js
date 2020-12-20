const bgVertexShaderSrc = `
precision mediump float;

attribute vec4 position;

varying vec2 vUv;

void main() {
    gl_Position = position;
    vUv = vec2( (position.x + 1.)/2., (position.y + 1.)/2.);
}
`;
const bgFragmentShaderSrc = `
precision mediump float;

varying vec2 vUv;

uniform vec3 uColor0;
uniform vec3 uColor1;

void main(){
	float uTrans = sqrt(vUv.x * vUv.x + vUv.y * vUv.y)/sqrt(2.0);
	vec3 color = mix(uColor0, uColor1, uTrans);
	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = vec4(1.0);
}
`;

const renderVertexShaderSrc = bgVertexShaderSrc;
const renderFragmentShaderSrc = `
precision mediump float;

varying vec2 vUv;

uniform sampler2D uMainTexture;
uniform sampler2D uMain2Texture;
uniform sampler2D uTransTexture;
uniform float uTrans;

void main(){
	vec4 color1 = texture2D(uMainTexture, vUv);
	vec4 color2 = texture2D(uMain2Texture, vUv);
	float trans = texture2D(uTransTexture, vUv).r;
	float rate = clamp( uTrans * 1.5 - trans * 0.5, 0.0, 1.0);

	rate = smoothstep(0., 1.0, rate);

	gl_FragColor = mix(color1, color2, rate);
}

`;

const boxVertexShaderSrc = `
precision mediump float;

attribute vec4 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

varying vec3 vNormal;
varying vec2 vUv;

void main(){
    gl_Position = projectionMatrix * modelViewMatrix * position;
	vNormal =   normalize(normalMatrix * normal);
	vUv = vec2( (gl_Position.x / gl_Position.w + 1.)/2., (gl_Position.y / gl_Position.w + 1.)/2. );
}
`;

const boxFragmentShaderSrc = `
precision mediump float;

varying vec3 vNormal;
varying vec2 vUv;

uniform vec3 uColor0;
uniform vec3 uColor1;

void main() {
  vec3 normal = vNormal;
  float light = max(dot(normal, normalize(vec3(1.0, 1.0, 1.0))), 0.0);

  float rate = 0.1 * light;
  float trans = vUv.x * 0.4 + 0.3;
  vec3 color = mix(uColor0, uColor1, trans);
  gl_FragColor = vec4(color + vec3(rate), 1.);
}
`;

class Camera extends THREE.PerspectiveCamera {
  constructor(options) {
    super(60, windowWid / windowHig, 1, 100000);

    this._target = { x: 0, y: 0 };
    this._cur = { x: 0, y: 0 };
    this._lookAtTarget = new THREE.Vector3();
  }
  update() {
    this._cur.x += (this._target.x - this._cur.x) / 10;
    this._cur.y += (this._target.y - this._cur.y) / 10;

    let theta = (this._cur.x * Math.PI) / 10;
    let phi = (this._cur.y * Math.PI) / 10;

    let rad = 1000;
    let xx = rad * Math.sin(theta);
    let yy = rad * Math.cos(theta) * Math.sin(phi);
    let zz = rad * Math.cos(theta) * Math.cos(phi);

    this.position.set(xx, yy, zz);
    this.lookAt(this._lookAtTarget);
  }
  resize() {
    this.aspect = windowWid / windowHig;
    this.updateProjectionMatrix();
  }
  mousemove(target) {
    this._target.x = target.x;
    this._target.y = target.y;
  }
}

let loadingDiv = document.getElementById("loading");
let canvas = document.getElementById("main");
let loopId;

let windowWid = window.innerWidth;
let windowHig = window.innerHeight;
let obj = {
  trans: 0,
  targetTrans: 0,
};

let renderer;
let bgScene,
  scenes = [],
  mainScene;
let perspectiveCamera;
let perlinTexture;
let bgMesh;
let bgMat, boxMat;
let mainMesh;
let sceneColors = [
  [
    [0.18, 0.19, 0.57],
    [0.11, 0.6, 0.9],
  ],
  [
    [0.84, 0.52, 1],
    [0, 1, 0.93],
  ],
];

let boxes = [];
let renderTargetArr = [];

initThree();
createWebGLRenderTarget();
createBg();
createBox();
createMain();

loadImage();

function initThree() {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.autoClear = false;
  renderer.setSize(windowWid, windowHig);
  bgScene = new THREE.Scene();
  scenes.push(new THREE.Scene(), new THREE.Scene());
  mainScene = new THREE.Scene();

  // カメラの初期化
  perspectiveCamera = new Camera();
}

function createWebGLRenderTarget() {
  renderTargetArr.push(
    new THREE.WebGLRenderTarget(windowWid, windowHig),
    new THREE.WebGLRenderTarget(windowWid, windowHig)
  );
}

function createBg() {
  let geo = new THREE.PlaneGeometry(2, 2);
  let mat = new THREE.RawShaderMaterial({
    uniforms: {
      uColor0: { value: new THREE.Vector3() },
      uColor1: { value: new THREE.Vector3() },
    },
    vertexShader: bgVertexShaderSrc,
    fragmentShader: bgFragmentShaderSrc,
  });
  bgMesh = new THREE.Mesh(geo, mat);
  bgMat = mat;

  bgScene.add(bgMesh);
}

function createBox() {
  let mat = new THREE.RawShaderMaterial({
    uniforms: {
      uColor0: { value: new THREE.Vector3() },
      uColor1: { value: new THREE.Vector3() },
    },
    vertexShader: boxVertexShaderSrc,
    fragmentShader: boxFragmentShaderSrc,
  });
  let geo = new THREE.BoxGeometry(1, 1, 1);
  boxMat = mat;

  let posX, posY, posZ, rotationX, rotationY, rotationZ, size;
  let totalSize = 100;
  let halfSize = totalSize / 2;
  for (let ii = 0; ii < totalSize; ii++) {
    size = 30 + 30 * Math.random();
    let box = new THREE.Mesh(geo, mat);

    if (ii < halfSize) {
      posX = -400 + 800 * Math.random();
      posY = 200 - 400 * Math.random();
      posZ = -1000 * Math.random() + 500;
    } else {
      let rad = 300; // * Math.random();
      let theta = 2 * Math.PI * Math.random();
      let phi = Math.PI * Math.random();
      posX = rad * Math.cos(theta);
      posY = rad * Math.sin(theta) * Math.cos(phi);
      posZ = rad * Math.sin(theta) * Math.sin(phi);
    }

    rotationX = 2 * Math.PI * Math.random();
    rotationY = 2 * Math.PI * Math.random();
    rotationZ = 2 * Math.PI * Math.random();

    box.scale.set(size, size, size);
    box.position.set(posX, posY, posZ);
    box.rotation.set(rotationX, rotationY, rotationZ);
    let velScale = 0.02;
    box.rotSpeed = new THREE.Vector3(
      velScale * (Math.random() - 0.5),
      velScale * (Math.random() - 0.5),
      velScale * (Math.random() - 0.5)
    );

    if (ii < halfSize) scenes[0].add(box);
    else scenes[1].add(box);

    boxes.push(box);
  }
}

function createMain() {
  let geo = new THREE.PlaneGeometry(2, 2);
  let mat = new THREE.RawShaderMaterial({
    uniforms: {
      uMainTexture: { value: renderTargetArr[0].texture },
      uMain2Texture: { value: renderTargetArr[1].texture },
      uTransTexture: { value: null },
      uTrans: { value: 0 },
    },
    vertexShader: renderVertexShaderSrc,
    fragmentShader: renderFragmentShaderSrc,
  });

  mainMesh = new THREE.Mesh(geo, mat);
  mainScene.add(mainMesh);
}

function loadImage() {
  const url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/13842/perlin.png";
  let image = new Image();

  image.onload = () => {
    perlinTexture = new THREE.Texture(image);
    perlinTexture.needsUpdate = true;

    mainMesh.material.uniforms.uTransTexture.value = perlinTexture;

    start();
  };

  image.crossOrigin = "Anonymous";
  image.src = url;
}

function start() {
  loadingDiv.style.display = "none";
  loopId = requestAnimationFrame(loop);
}

function loop() {
  obj.trans += (obj.targetTrans - obj.trans) / 20;
  perspectiveCamera.update();

  for (let ii = 0; ii < scenes.length; ii++) {
    // renderer.clear(true, true, true);
    renderer.clearTarget(renderTargetArr[ii], true, true, true);
    bgMat.uniforms.uColor0.value.set(
      sceneColors[ii][0][0],
      sceneColors[ii][0][1],
      sceneColors[ii][0][2]
    );
    bgMat.uniforms.uColor1.value.set(
      sceneColors[ii][1][0],
      sceneColors[ii][1][1],
      sceneColors[ii][1][2]
    );
    renderer.render(bgScene, perspectiveCamera, renderTargetArr[ii]);
    renderer.clearTarget(renderTargetArr[ii], false, true, false);
    boxMat.uniforms.uColor0.value.set(
      sceneColors[ii][0][0],
      sceneColors[ii][0][1],
      sceneColors[ii][0][2]
    );
    boxMat.uniforms.uColor1.value.set(
      sceneColors[ii][1][0],
      sceneColors[ii][1][1],
      sceneColors[ii][1][2]
    );
    renderer.render(scenes[ii], perspectiveCamera, renderTargetArr[ii]);
  }

  mainMesh.material.uniforms.uTrans.value = obj.trans;

  renderer.render(mainScene, perspectiveCamera);

  loopId = requestAnimationFrame(loop);
}

function resize() {
  windowWid = window.innerWidth;
  windowHig = window.innerHeight;
  perspectiveCamera.resize();
  renderer.setSize(windowWid, windowHig);

  for (let ii = 0; ii < 2; ii++) {
    renderTargetArr[ii].setSize(windowWid, windowHig);
  }
}

window.addEventListener("resize", function () {
  resize();
});

window.addEventListener("keydown", function (ev) {
  switch (ev.which) {
    case 27:
      if (loopId) {
        cancelAnimationFrame(loopId);
        loopId = null;
      } else {
        loopId = requestAnimationFrame(loop);
      }

      break;
  }
});

window.addEventListener("mousemove", ev => {
  let xx = ev.clientX;
  let yy = ev.clientY;

  perspectiveCamera.mousemove({
    x: (xx / windowWid) * 2 - 1,
    y: (yy / windowHig) * 2 - 1,
  });
  obj.targetTrans = xx / windowWid;
});
