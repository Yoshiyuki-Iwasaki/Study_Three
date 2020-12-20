// ページの読み込みを待つ
window.addEventListener("load", init);

window.addEventListener("mousemove", onDocumentMouseMove, false);

// サイズを指定
const width = window.innerWidth;
const height = window.innerHeight;

let mouseX = 0,
  mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) * 10;
  mouseY = (event.clientY - windowHalfY) * 10;
}

function init() {
  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
    antialias: true,
    devicePixelRatio: window.devicePixelRatio,
  });
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0000000);
  scene.fog = new THREE.Fog(0xffffff, 1, 10000);

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, +1200);
  camera.position.z = 500;

  // グループを作成
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
  const material = new THREE.MeshStandardMaterial();

  for (let i = 0; i < 1000; i++) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 1500;
    mesh.position.y = (Math.random() - 0.5) * 1500;
    mesh.position.z = (Math.random() - 0.5) * 1500;
    mesh.rotation.x = Math.random() * 2 * Math.PI;
    mesh.rotation.y = Math.random() * 2 * Math.PI;
    mesh.rotation.z = Math.random() * 2 * Math.PI;

    // グループに格納する
    group.add(mesh);
  }

  // 光源
  scene.add(new THREE.DirectionalLight(0xffffff, 2)); // 平行光源
  scene.add(new THREE.AmbientLight(0xffffff)); // 環境光源

  // 毎フレーム時に実行されるループイベントです
  render();
  function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
}
