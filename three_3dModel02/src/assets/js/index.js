import * as THREE from "three";
import fragment from "../../glsl/fragment.glsl";
import matcap1 from "../img/image.jpg";
import vertex from "../../glsl/vertexParticle.glsl";
import * as dat from "dat.gui";
let OrbitControls = require("three-orbit-controls")(THREE);
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import modelFile from "../model/apple.glb";
import modelFile02 from "../model/test.glb";

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0x000000, 1);

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);
    this.loader = new GLTFLoader();

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
  }

  settings() {
    let that = this;
    this.settings = {
      time: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "time", 0, 100, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    //image cover
    this.imageAspect = 853 / 1280;
    let a1, a2;
    if (this.height / this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
      a1 = 1;
      a2 = (this.width / this.height) * this.imageAspect;
    }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    let matcapMaterial = new THREE.MeshMatcapMaterial({
      matcap: new THREE.TextureLoader().load(matcap1),
    });

    // this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    // this.plane = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.plane);

    this.loader.load(modelFile, gltf => {
      this.model = gltf.scene.children[0].children[0];
      this.model02 = gltf.scene.children[0].children[1];
      this.model03 = gltf.scene.children[0].children[2];

      this.model.material = this.material;
      this.model.material = matcapMaterial;
      this.model02.material = this.material;
      this.model03.material = this.material;

      this.model.geometry.scale(5, 5, 5);
      this.model02.geometry.scale(5, 5, 5);
      this.model03.geometry.scale(5, 5, 5);

      //  create particle
      let points = new THREE.Points(this.model.geometry, this.material);
      let points02 = new THREE.Points(this.model02.geometry, this.material);
      let points03 = new THREE.Points(this.model03.geometry, this.material);
      this.scene.add(points);
      this.scene.add(points02);
      this.scene.add(points03);

      // end of it

      // this.obsidiangeometry = this.model.geometry.clone();
      // let obsid = new THREE.Mesh(this.obsidiangeometry.matcapMaterial);

      // this.scene.add(obsid);

      // this.scene.add(this.model);
      // this.scene.add(this.model02);
      // this.scene.add(this.model03);
    });
  }
  stop() {
    this.paused = true;
  }

  play() {
    this.paused = false;
    this.render();
  }

  render() {
    if (this.paused) return;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch("container");
