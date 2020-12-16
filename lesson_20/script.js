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
  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
  camera.position.z = 1;
  camera.rotation.x = Math.PI / 2;
  // 形状データを作成
  const starGeo = new THREE.Geometry();
  // 配置する個数
  const LENGTH = 6000;
  var star;
  for (let i = 0; i < LENGTH; i++) {
    var star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    star.velocity = 0;
    star.acceleration = 0.02;
    starGeo.vertices.push(star);
  }
  // マテリアルを作成
  const material = new THREE.PointsMaterial({
    // 一つ一つのサイズ
    size: 0.5,
    // 色
    color: 0xffffff,
  });

  const mesh = new THREE.Points(starGeo, material);
  scene.add(mesh);
  // 平行光源
  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  // シーンに追加
  scene.add(light);
  // 初回実行
  render();

  function render() {
    starGeo.vertices.forEach(p => {
      p.velocity += p.acceleration;
      p.y -= p.velocity;
      if (p.y < -200) {
        p.y = 200;
        p.velocity = 0;
      }
    });

    starGeo.verticesNeedUpdate = true;
    mesh.rotation.y += 0.002;
    // レンダリング
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
}
