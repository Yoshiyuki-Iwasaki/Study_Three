window.addEventListener("DOMContentLoaded", init);

function init() {
  // サイズを取得
  const width = window.innerWidth;
  const height = window.innerHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#myCanvas"),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, +5);

  // // カメラコントローラーを作成
  const controls = new THREE.OrbitControls(camera);

  // // 滑らかにカメラコントローラーを制御する
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  //半径
  const r = 100;

  //頂点数
  const starsNum = 50000;

  // 形状データを作成
  const geometry = new THREE.Geometry();
  // 配置する範囲
  const SIZE = 3000;
  // 配置する個数
  const LENGTH = 1000;
  for (let i = 0; i < LENGTH; i++) {
    geometry.vertices.push(
      new THREE.Vector3(
        SIZE * (Math.random() - 0.5),
        SIZE * (Math.random() - 0.5),
        SIZE * (Math.random() - 0.5)
      )
    );
  }
  // マテリアルを作成
  const material = new THREE.PointsMaterial({
    // 一つ一つのサイズ
    size: 5,
    // 色
    color: 0xffffff,
  });

  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);
  // 平行光源
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  // シーンに追加
  scene.add(light);

  // 初回実行
  render();

  function render() {
    // カメラコントローラーを更新
    controls.update();
    const time = performance.now() * 0.001;
    const r = 1;
    const k = 1;

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
}
