import * as THREE from "three";
import fox from "../img/image.jpg";
import fragment from "../../glsl/fragment.glsl";
import fragmentLine from "../../glsl/fragmentLine.glsl";
import vertex from "../../glsl/vertex.glsl";
import vertexParticle from "../../glsl/vertexParticle.glsl";
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
    this.renderer.setClearColor(0x000000, 1);

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(50, 1, 0.001, 1000);

    this.camera.position.set(0, 0, 4);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.playHead = 0;

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
        playHead: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.material1 = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        playHead: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: vertex,
      fragmentShader: fragmentLine,
    });

    this.material2 = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        playHead: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader: vertex,
      fragmentShader: fragmentLine,
    });

    this.geometry = new THREE.IcosahedronBufferGeometry(1, 3);
    this.edgeGeo = new THREE.EdgesGeometry(this.geometry);
    // this.geometry = new THREE.SphereGeometry(1, 32, 16);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.meshLine = new THREE.LineSegments(this.edgeGeo, this.material1);
    this.meshPoints = new THREE.Points(this.geometry, this.material2);
    this.meshSphere = new THREE.Mesh(
      this.geometry,
      new THREE.MeshNormalMaterial()
    );

    this.scene.add(this.mesh);
    this.scene.add(this.meshLine);
    this.scene.add(this.meshPoints);
    this.scene.add(this.meshSphere);

    this.meshLine.scale.set(1.001, 1.001, 1.001);
    this.meshPoints.scale.set(1.005, 1.005, 1.005);
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
    this.playHead += 0.005;
    this.material.uniforms.time.value = this.time;
    this.material.uniforms.playHead.value = this.playHead;
    this.material1.uniforms.playHead.value = this.playHead;
    this.material2.uniforms.playHead.value = this.playHead;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch("container");
