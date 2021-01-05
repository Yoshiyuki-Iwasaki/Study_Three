// ページの読み込みを待つ
window.addEventListener("load", init);

function init() {
  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
    antialias: true,
    devicePixelRatio: window.devicePixelRatio,
  });
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // フォグを設定
  scene.fog = new THREE.Fog(0x000000, 50, 2000);

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, +20);

  // // カメラコントローラーを作成
  const controls = new THREE.OrbitControls(camera);

  // // 滑らかにカメラコントローラーを制御する
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  // グループを作成
  const group = new THREE.Group();
  scene.add(group);
  const material = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load("image.jpg"),
  });

  for (let i = 0; i < 1000; i++) {
    const sprite = new THREE.Sprite(material);
    sprite.position.x = (Math.random() - 0.5) * 50;
    sprite.position.y = (Math.random() - 0.5) * 50;
    sprite.position.z = (Math.random() - 0.5) * 50;
    sprite.rotation.x = Math.random() * 2 * Math.PI;
    sprite.rotation.y = Math.random() * 2 * Math.PI;
    sprite.rotation.z = Math.random() * 2 * Math.PI;

    // グループに格納する
    scene.add(sprite);
  }

  // 光源
  scene.add(new THREE.DirectionalLight(0xffffff, 2)); // 平行光源
  scene.add(new THREE.AmbientLight(0xffffff)); // 環境光源

  // 毎フレーム時に実行されるループイベントです
  render();

  function render() {
    // カメラコントローラーを更新
    controls.update();

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
}
