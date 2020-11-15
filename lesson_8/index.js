window.addEventListener('DOMContentLoaded', init);

// 初期化のために実行
// onResize();
// // リサイズイベント発生時に実行
// window.addEventListener('resize', onResize);

// function onResize() {
//   // サイズを取得
//   const width = window.innerWidth;
  
//   const height = window.innerHeight;
  
//   // レンダラーのサイズを調整する
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(width, height);

//   // カメラのアスペクト比を正す
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// }

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

  // カメラを作成
  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
  camera.position.set(0, 0, +20);

let triangle;
let uniforms;
let step = 0;
 
const vertexShader =`
    attribute vec3 color;
 
    //カスタムattributeの取得
    attribute vec3 displacement;
 
    varying vec3 vColor;
 
    void main(){
        vColor = color;
 
        //頂点座標positionにカスタムattributeを加えて頂点座標をアニメーション
        vec3 vv = position + displacement;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vv,1.0);
    }
`;
 
const fragmentShader =`
 
    //uniformの取得
    uniform float step;
 
    varying vec3 vColor;
 
    void main(){
 
        //uniformのstepを使用して頂点カラーをアニメーション
        float r = vColor.r + cos(step/50.0);
        float g = vColor.g + cos(step/60.0);
        float b = vColor.b + cos(step/70.0);
 
        gl_FragColor = vec4(r,g,b,1.0);
    }
`;
 
const positions = new Float32Array([
    2.5,0.0,0.0,
    0,5.0,0.0,
    -2.5,0.0,0.0,
    ]);
const colors = new Float32Array([
    1.0,0.0,0.0,
    0.0,0.0,1.0,
    0.0,1.0,0.0,
    ]);
 
//型付配列でカスタムattribute用の変数を設定
const displacement = new Float32Array(3*3);
 
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 
//バッファーオブジェクトのattributeにカスタムattributeを設定
geometry.setAttribute('displacement',new THREE.BufferAttribute(displacement,3));
 
//シェーダーへ転送するuniformを設定
uniforms = {
    step:{type:'f',value:1.0}
};
 
const material = new THREE.ShaderMaterial({
    vertexShader:vertexShader,
    fragmentShader:fragmentShader,
 
    //uniformを設定
    uniforms:uniforms,
    side:THREE.DoubleSide,
});
triangle = new THREE.Mesh(geometry,material);
scene.add(triangle);
 
function rendering(){
    requestAnimationFrame(rendering);
 
    //stepの値を増加して、uniformに代入
    step ++;
    uniforms.step.value = step;
 
    //カスタムattributeを更新
    triangle.geometry.attributes.displacement.array[0] = 1.25 * Math.sin(step/50);
    triangle.geometry.attributes.displacement.array[4] = 1.25* Math.sin(step/60);
    triangle.geometry.attributes.displacement.array[6] = -1.25 * Math.sin(step/70);
 
    //カスタムattributeの更新を通知するフラグ
    triangle.geometry.attributes.displacement.needsUpdate = true;
 
    renderer.render(scene,camera);
}

  // 平行光源
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
    plane.rotation.x += 0.01;
    plane.rotation.y += 0.01;

    // レンダリング
    renderer.render(scene, camera);
  }
}
