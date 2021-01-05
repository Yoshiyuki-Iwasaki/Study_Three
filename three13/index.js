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
    wireframe: true,
  };

  var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: "./glsl/vertex.glsl",
    fragmentShader: "./glsl/fragment.glsl",
  });

  var mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // サイズを取得
  const width = window.innerWidth;
  const height = window.innerHeight;
  const container = document.getElementById("container");

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  onWindowResize();
  window.addEventListener("resize", onWindowResize, false);

  document.onmousemove = function (e) {
    uniforms.u_mouse.value.x = e.pageX;
    uniforms.u_mouse.value.y = e.pageY;
    console.log("test");
  };
}

function onWindowResize(event) {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;
  console.log("test2");
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  uniforms.u_time.value += 0.05;
  renderer.render(scene, camera);
}
