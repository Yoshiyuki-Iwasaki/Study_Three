import {
  Renderer,
  Camera,
  Texture,
  Transform,
  Program,
  Mesh,
  Plane,
  Orbit,
} from "ogl";
import name01 from "../../dist/name01.png";
import name02 from "../../dist/name02.png";
import * as dat from "dat.gui";

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : null;
}

var colors = require("nice-color-palettes");

let rand = Math.floor(Math.random() * 100);
let p = colors[rand];
let palette = p.map(c => {
  return hexToRgb(c);
});

let settings = {
  transition: 0,
};
let gui = new dat.GUI();
gui.add(settings, "transition", 0, 1, 0.01);

const vertex = /* glsl */ `
    precision highp float;
    precision highp int;
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec3 offset;
    attribute vec3 random;
    attribute vec3 color;
    attribute vec2 textureCoord;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    uniform sampler2D uStart;
    uniform sampler2D uEnd;
    uniform float uTransition;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vColor = color;
      vec3 pos = position + offset;
      pos.z = random.z * 0.05;
      float uStartAlpha = step(0.5,texture2D(uStart, textureCoord).r);
      float uEndAlpha = step(0.5,texture2D(uEnd, textureCoord).r);
      float show = max(uStartAlpha,uEndAlpha);
      vAlpha = show*mix(uStartAlpha,uEndAlpha,uTransition);

      // rotate
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;
const fragment = /* glsl */ `
    precision highp float;
    precision highp int;
    varying vec3 vNormal;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      if(vAlpha<0.5) discard;
      gl_FragColor = vec4(vColor,1.);
    }
`;

{
  const renderer = new Renderer({ dpr: 2 });
  const gl = renderer.gl;
  document.body.appendChild(gl.canvas);
  gl.clearColor(1, 1, 1, 1);

  const camera = new Camera(gl, { fov: 15 });
  camera.position.set(0, 0, 1);
  camera.lookAt([0, 0, 0]);
  const controls = new Orbit(camera);

  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
  }
  window.addEventListener("resize", resize, false);
  resize();

  const scene = new Transform();

  /*
  ACTUALLY ADDING OBJECTS
  */

  // Upload empty texture while source loading
  const texture = new Texture(gl);
  const img = new Image();
  img.src = name01;
  img.onload = () => (texture.image = img);

  const texture02 = new Texture(gl);
  const img02 = new Image();
  img02.src = name02;
  img02.onload = () => (texture02.image = img02);

  const num = 70000;

  let offset = new Float32Array(num * 3);
  let random = new Float32Array(num * 3);
  let colors = new Float32Array(num * 3);
  let textureCoord = new Float32Array(num * 2);
  for (let i = 0; i < num; i++) {
    let x = (Math.random() * 2 - 1) * 0.5;
    let y = (Math.random() * 2 - 1) * 0.5;
    offset.set([x, y, 0], i * 3);
    textureCoord.set([x + 0.5, y + 0.5], i * 2);
    let color = palette[Math.floor(Math.random() * 5)];
    colors.set([color.r, color.g, color.a], i * 3);

    // unique random values are always handy for instances.
    // Here they will be used for rotation, scale and movement.
    random.set([Math.random(), Math.random(), Math.random()], i * 3);
  }

  const planeGeometry = new Plane(gl, {
    width: 0.01,
    height: 0.01,
    widthSegments: 1,
    heightSegments: 10,
    attributes: {
      offset: { instanced: 1, size: 3, data: offset },
      random: { instanced: 1, size: 3, data: random },
      color: { instanced: 1, size: 3, data: colors },
      textureCoord: { instanced: 1, size: 2, data: textureCoord },
    },
  });

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uStart: { value: texture },
      uEnd: { value: texture02 },
      uTransition: { value: 0 },
    },
    // Don't cull faces so that plane is double sided - default is gl.BACK
    cullFace: null,
  });

  const plane = new Mesh(gl, {
    geometry: planeGeometry,
    program,
    // mode: gl.LINE_LOOP,
  });
  plane.setParent(scene);

  /*
  ACTUALLY ADDING OBJECTS
  */

  requestAnimationFrame(update);
  function update() {
    requestAnimationFrame(update);
    controls.update();
    program.uniforms.uTransition.value = settings.transition;
    renderer.render({ scene, camera });
  }
}
