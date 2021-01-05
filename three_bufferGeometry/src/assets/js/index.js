import * as THREE from "three";
import fragment from "../../glsl/fragment.glsl";
import vertex from "../../glsl/vertex.glsl";
import * as dat from "dat.gui";
let OrbitControls = require("three-orbit-controls")(THREE);

import mask from "../img/mask.jpg";
import t1 from "../img/t.jpg";
import t2 from "../img/t1.jpg";

export default class Canvas {
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

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    this.camera.position.z = 1000;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.textures = [
      new THREE.TextureLoader().load(t1),
      new THREE.TextureLoader().load(t2),
    ];
    this.mask = new THREE.TextureLoader().load(mask);

    this.paused = false;

    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
    this.mouseEffects();
  }

  mouseEffects() {
    window.addEventListener("wheel", e => {
      console.log(e.wheelDeltaY);
    });
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
      uniforms: {
        time: { type: "f", value: 0 },
        move: { type: "f", value: 0 },
        progress: { type: "f", value: 0 },
        t1: { type: "f", value: this.textures[0] },
        t2: { type: "f", value: this.textures[1] },
        mask: { type: "f", value: this.mask },
        resolution: { type: "v4", value: new THREE.Vector4() },
      },
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    let number = 521 * 521;
    this.geometry = new THREE.BufferGeometry();
    this.positions = new THREE.BufferAttribute(new Float32Array(number * 3), 3);
    this.coordinates = new THREE.BufferAttribute(
      new Float32Array(number * 3),
      3
    );
    this.speeds = new THREE.BufferAttribute(new Float32Array(number * 3), 3);
    this.offset = new THREE.BufferAttribute(new Float32Array(number * 3), 3);
    function rand(a, b) {
      return a + (b - a) * Math.random();
    }
    let index = 0;
    for (let i = 0; i < 512; ++i) {
      let posX = i - 256;
      for (let j = 0; j < 512; ++j) {
        this.positions.setXYZ(index, posX * 2, (j - 256) * 2, 0);
        this.coordinates.setXYZ(index, i, j, 0);
        this.speeds.setX(index, rand(0.4, 1));
        this.offset.setX(index, rand(-1000, 1000));
        index++;
      }
    }

    this.geometry.setAttribute("position", this.positions);
    this.geometry.setAttribute("aCoordinates", this.coordinates);
    this.geometry.setAttribute("aSpeed", this.speeds);
    this.geometry.setAttribute("aOffset", this.offset);
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
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
    this.time++;
    // this.mesh.rotation.x += 0.01;
    // this.mesh.rotation.y += 0.02;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.move.value = this.move;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Canvas("container");
