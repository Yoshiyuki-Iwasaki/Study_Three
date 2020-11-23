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
  camera.position.set(0, 0, +500);

  // // カメラコントローラーを作成
  const controls = new THREE.OrbitControls(camera);

  // // 滑らかにカメラコントローラーを制御する
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;

  //半径
  const r = 150;

  //頂点数
  const starsNum = 0000;

  // 1辺あたりに配置するオブジェクトの個数
  const CELL_NUM = 25;

  // 空のジオメトリを作成
  const geometry = new THREE.Geometry();

  // Box
  for (let i = 0; i < CELL_NUM; i++) {
    for (let j = 0; j < CELL_NUM; j++) {
      for (let k = 0; k < CELL_NUM; k++) {
        // 立方体個別の要素を作成
        const sampleGeometry = new THREE.BoxGeometry(5, 5, 5);

        // 座標調整の行列を作成
        const matrix = new THREE.Matrix4();
        matrix.makeTranslation(
          10 * (i - CELL_NUM / 2),
          10 * (j - CELL_NUM / 2),
          10 * (k - CELL_NUM / 2)
        );

        // ジオメトリをマージ（結合）
        geometry.merge(sampleGeometry, matrix);
      }
    }
  }

  // マテリアルを作成
  const material = new THREE.MeshNormalMaterial();
  // メッシュを作成
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  // 平行光源
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  // シーンに追加
  scene.add(light);

  // 初回実行
  render();

  function render() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
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
