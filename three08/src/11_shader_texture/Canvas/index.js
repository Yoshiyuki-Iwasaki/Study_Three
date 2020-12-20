import * as THREE from "three";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { OrthographicCamera } from "three/src/cameras/OrthographicCamera";
import { Scene } from "three/src/scenes/Scene";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { Mesh } from "three/src/objects/Mesh";
import { Vector2 } from "three/src/math/Vector2";

// シェーダーソース
import vertexSource from "./shaders/shader.vert";
import fragmentSource from "./shaders/shader.frag";

export default class Canvas {
  constructor() {
    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    // レンダラーを作成
    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.w, this.h); // 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio); // ピクセル比

    // #canvas-containerにレンダラーのcanvasを追加
    const container = document.getElementById("canvas-container");
    container.appendChild(this.renderer.domElement);

    // カメラを作成（背景シェーダーだけならパースいらないので、OrthographicCameraをつかう）
    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1);

    // シーンを作成
    this.scene = new Scene();

    // 平面をつくる（幅, 高さ, 横分割数, 縦分割数）
    let originBox = new THREE.BoxBufferGeometry(0.3, 0.3, 0.3);
    let geo = new THREE.InstancedBufferGeometry();

    let vertice = originBox.attributes.position.clone();
    geo.addAttribute("position", vertice);

    let normal = originBox.attributes.normal.clone();
    geo.addAttribute("normals", normal);

    let uv = originBox.attributes.normal.clone();
    geo.addAttribute("uv", uv);

    let indices = originBox.index.clone();
    geo.setIndex(indices);

    let offsetPos = new THREE.InstancedBufferAttribute(
      new Float32Array(this.num * 3),
      3,
      false,
      1
    );
    let num = new THREE.InstancedBufferAttribute(
      new Float32Array(this.num * 1),
      1,
      false,
      1
    );

    for (let i = 0; i < this.num; i++) {
      let range = 5;
      let x = Math.random() * range - range / 2;
      let y = Math.random() * range - range / 2;
      let z = Math.random() * range - range / 2;
      offsetPos.setXYZ(i, x, y, z);
      num.setX(i, i);
    }

    geo.addAttribute("offsetPos", offsetPos);
    geo.addAttribute("num", num);

    let cUni = {
      time: {
        value: 0,
      },
    };

    this.uni = THREE.UniformsUtils.merge([
      THREE.ShaderLib.standard.uniforms,
      cUni,
    ]);
    this.uni.diffuse.value = new THREE.Vector3(1.0, 1.0, 1.0);
    this.uni.roughness.value = 0.1;

    let mat = new THREE.ShaderMaterial({
      vertexShader: vertexSource,
      fragmentShader: fragmentSource,
      uniforms: this.uni,
      flatShading: true,
      lights: true,
    });

    this.obj = new THREE.Mesh(geo, mat);

    // マウス座標
    this.mouse = new Vector2(0.5, 0.5);
    this.targetPercent = 0.0;

    // メッシュをシーンに追加
    this.scene.add(this.mesh);

    // 描画ループ開始
    this.render();
  }

  render() {
    // 次のフレームを要求
    requestAnimationFrame(() => {
      this.render();
    });

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
