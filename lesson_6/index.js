// ページの読み込みを待つ
window.addEventListener('load', init);

function init() {
  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas'),
    antialias: true,
    devicePixelRatio: window.devicePixelRatio
  });
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();
  
  // フォグを設定
  scene.fog = new THREE.Fog(0x000000, 50, 2000);
  
  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +1200);

  // // // カメラコントローラーを作成
  // const controls = new THREE.OrbitControls(camera);

  // // // 滑らかにカメラコントローラーを制御する
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.2;

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
  scene.add(new THREE.DirectionalLight(0xFFFFFF, 2)); // 平行光源
  scene.add(new THREE.AmbientLight(0xFFFFFF)); // 環境光源

  // 毎フレーム時に実行されるループイベントです
  tick();

  function tick() {

    // カメラコントローラーを更新
    // controls.update();

    // グループを回す
    group.rotateY(0.001);
    group.rotateX(0.001);

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(tick);
  }
}