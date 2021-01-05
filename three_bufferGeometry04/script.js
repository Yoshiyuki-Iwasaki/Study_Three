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

  const geometry = new THREE.BufferGeometry();
  // create a simple square shape. We duplicate the top left and bottom right
  // vertices because each vertex needs to appear once per triangle.
  const vertices = new Float32Array([
    -1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    1.0,
    1.0,

    1.0,
    1.0,
    1.0,
    -1.0,
    1.0,
    1.0,
    -1.0,
    -1.0,
    1.0,
  ]);

  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const mesh = new THREE.Mesh(geometry, material);
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
