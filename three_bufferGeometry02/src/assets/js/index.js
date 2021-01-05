import * as THREE from "three";

import brush from "../img/brush03.png";
import fragment from "../../glsl/fragment.glsl";
import vertex from "../../glsl/vertex.glsl";
import * as dat from "dat.gui";
// import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch {
  constructor(selector) {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer();

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xe7e2e2, 1);

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    this.camera.position.set(0, 0, 0.1);
    this.camera.lookAt(0, 0, 2);
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
        uTexture: { type: "t", value: new THREE.TextureLoader().load(brush) },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthTest: false,
      depthWrite: false,
      blend: THREE.MultiplyBlending,
    });

    this.geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 1, 1);

    this.ig = new THREE.InstancedBufferGeometry();
    this.ig.attributes = this.geometry.attributes;
    this.ig.index = this.geometry.index;

    let number = 1000;
    let translateArray = new Float32Array(number * 3);
    let rotateArray = new Float32Array(number);

    let radius = 0.7;

    for (let i = 0; i < number; i++) {
      let theta = Math.random() * 2 * Math.PI;
      translateArray.set(
        [
          radius * Math.sin(theta),
          radius * Math.cos(theta),
          -Math.random() * 5,
        ],
        3 * i
      );
      rotateArray.set([Math.random() * 2 * Math.PI], i);
    }

    this.ig.setAttribute(
      "translate",
      new THREE.InstancedBufferAttribute(translateArray, 3)
    );

    this.ig.setAttribute(
      "aRotate",
      new THREE.InstancedBufferAttribute(rotateArray, 1)
    );

    this.plane = new THREE.Mesh(this.ig, this.material);
    this.scene.add(this.plane);
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
