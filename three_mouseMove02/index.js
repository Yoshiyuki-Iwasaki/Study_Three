// ページの読み込みを待つ
window.addEventListener("load", init);

window.addEventListener("mousemove", onDocumentMouseMove, false);

// サイズを指定
const width = window.innerWidth;
const height = window.innerHeight;

let mouseX = 0,
  mouseY = 0,
  rot = 0;

function onDocumentMouseMove(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
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
  camera.position.set(0, 0, +200);
  // camera.position.z = 500;

  // グループを作成
  const group = new THREE.Group();
  scene.add(group);
  const geometry = new THREE.BoxBufferGeometry(50, 50, 50);
  const material = new THREE.MeshStandardMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  // グループに格納する
  scene.add(mesh);

  // 光源
  scene.add(new THREE.DirectionalLight(0xffffff, 2)); // 平行光源
  scene.add(new THREE.AmbientLight(0xffffff)); // 環境光源

  // 毎フレーム時に実行されるループイベントです
  render();
  function render() {
    // マウスの位置に応じて角度を設定
    // マウスのX座標がステージの幅の何%の位置にあるか調べてそれを360度で乗算する
    const targetRot = (mouseX / window.innerWidth) * 360;
    // イージングの公式を用いて滑らかにする
    // 値 += (目標値 - 現在の値) * 減速値
    rot += (targetRot - rot) * 0.02;

    // ラジアンに変換する
    const radian = (rot * Math.PI) / 180;
    // 角度に応じてカメラの位置を設定
    camera.position.x = 50 * Math.sin(radian);
    camera.position.y = 50 * Math.sin(radian);
    // camera.position.z = 1000 * Math.cos(radian);
    // 原点方向を見つめる
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // レンダリング
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
}
