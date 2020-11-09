window.addEventListener('DOMContentLoaded', init);

// 初期化のために実行
onResize();
// リサイズイベント発生時に実行
window.addEventListener('resize', onResize);

function onResize() {
  // サイズを取得
  const width = window.innerWidth;
  
  const height = window.innerHeight;
  
  // レンダラーのサイズを調整する
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // カメラのアスペクト比を正す
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function init() {
    // サイズを取得
    const width = window.innerWidth;
    const height = window.innerHeight;

  // レンダラーを作成
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);

  // シーンを作成
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2( 0xAA9966, 0.015 );


  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, +1000);

  // // 箱を作成
  // const geometry = new THREE.BoxGeometry(300, 300, 300);
  // const material = new THREE.MeshStandardMaterial({color: 0x00ffff});
  // const box = new THREE.Mesh(geometry, material);
  // scene.add(box);

  const geometry = new THREE.PlaneGeometry( 150, 150, 64, 64 );
  const material = new THREE.MeshBasicMaterial( {color: 0X6BB7BD} );
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI / -2;
  scene.add( plane );

  // // 平行光源
  const light = new THREE.DirectionalLight(0xFFFFFF);
  light.intensity = 2; // 光の強さを倍に
  light.position.set(1, 1, 1);
  // シーンに追加
  scene.add(light);

  // 初回実行
  tick();

  function tick() {
    requestAnimationFrame(tick);

    // 箱を回転させる
    // plane.rotation.x += 0.01;
    // plane.rotation.y += 0.01;

    // レンダリング
    renderer.render(scene, camera);
  }
}
