import fragment from "./glsl/fragment.glsl";
import vertex from "./glsl/vertex.glsl";

var container;
var camera, scene, renderer;
var uniforms;

init();
animate();

function init() {
  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  var geometry = new THREE.PlaneBufferGeometry(2, 2);

  uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_texture: {
      type: "t",
      value: new THREE.TextureLoader().load("icon.jpg"),
    },
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertex,
    fragmentShader: fragment,
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // サイズを取得
  const width = window.innerWidth;
  const height = window.innerHeight;
  container = document.getElementById("container");

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}
