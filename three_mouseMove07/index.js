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

  // 箱を作成
  const geometry = new THREE.SphereGeometry(3, 128, 128);

  // マテリアルにテクスチャーを設定
  const material = new THREE.MeshNormalMaterial();
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

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
    const time = performance.now() * 0.0005;
    const r = 1;
    const k = 1;

    for (let i = 0; i < sphere.geometry.vertices.length; i++) {
      //Vector3形式で頂点を取得
      const p = sphere.geometry.vertices[i];
      p.normalize().multiplyScalar(
        r +
          0.3 *
            noise.perlin3(
              p.x * k + time * 0.5,
              p.y * k + time * 0.5,
              p.z * k + time * 0.5
            )
      );
    }

    sphere.geometry.verticesNeedUpdate = true;
    sphere.geometry.computeVertexNormals();

    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
}
