import * as THREE from "three";
import fragment from "../../glsl/fragment.glsl";
import t from "../img/1.jpg";
import vertex from "../../glsl/vertexParticles.glsl";
import * as dat from "dat.gui";
let OrbitControls = require("three-orbit-controls")(THREE);
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { PostProcessing } from "./postprocessing";

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

    this.camera = new THREE.PerspectiveCamera(
      120,
      window.innerWidth / window.innerHeight,
      0.001,
      5000
    );

    this.camera.position.set(0, 0, 1500);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.renderScene = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.settings.bloomThreshold;
    this.bloomPass.strength = this.settings.bloomStrength;
    this.bloomPass.radius = this.settings.bloomRadius;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);

    this.customPass = new ShaderPass(PostProcessing);
    this.customPass.uniforms["resolution"].value = new THREE.Vector2(
      window.innerWidth,
      window.innerHeight
    );
    this.customPass.uniforms["resolution"].value.multiplyScalar(
      window.devicePixelRatio
    );
    this.composer.addPass(this.customPass);

    this.setupResize();
    this.addObjects();
    this.resize();
    this.render();
    // this.settings();
  }

  settings() {
    let that = this;
    this.settings = {
      distortion: 0,
      // bloomStrength: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "distortion", 0, 3, 0.01);
    // this.gui.add(this.settings, "bloomStrength", 0, 10, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.composer.setSize(this.width, this.height);

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
        distortion: { type: "f", value: 0 },
        t: { type: "f", value: new THREE.TextureLoader().load(t) },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      // wireframe:true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.SphereBufferGeometry(
      480 * 1.5,
      480 * 1.5,
      480,
      480
    );
    this.plane = new THREE.Points(this.geometry, this.material);
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
    this.material.uniforms.distortion.value = 0.08;
    this.customPass.uniforms.time.value = this.time;
    // this.bloomPass.strength = this.settings.bloomStrength;
    requestAnimationFrame(this.render.bind(this));
    // this.renderer.render(this.scene, this.camera);
    this.composer.render();
  }
}

new Sketch("container");
