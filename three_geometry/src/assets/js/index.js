import * as THREE from "three";
let OrbitControls = require("three-orbit-controls")(THREE);
import image from "../img/image.jpg";
import Delaunator from "delaunator";
import fragment from "../../glsl/fragment.glsl";
import vertex from "../../glsl/vertex.glsl";

let dots = [];

dots.push([0, 0]);
dots.push([500, 0]);
dots.push([500, 500]);
dots.push([0, 500]);

for (var i = 0; i < 50; i++) {
  dots.push([Math.floor(Math.random() * 500), Math.floor(Math.random() * 500)]);
}

const delaunator = Delaunator.from(dots);
const triangles = delaunator.triangles;

var width, height, container, camera, controls, scene, renderer, geometry;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  renderer = new THREE.WebGLRenderer();

  width = window.innerWidth;
  height = window.innerHeight;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xeeeeee, 1);

  container = document.getElementById("container");
  width = container.offsetWidth;
  height = container.offsetHeight;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    3000
  );

  camera.position.z = 200;
  controls = new OrbitControls(camera, renderer.domElement);

  var loader = new THREE.TextureLoader();
  loader.load(image, function (texture) {
    // this.texture = new THREE.TextureLoader().load(image);
    var material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives: enable",
      },
      uniforms: {
        textureSampler: { type: "t", value: null },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
    });

    material.uniforms.textureSampler.value = texture;

    geometry = new THREE.Geometry();

    geometry.computeBoundingBox();

    var max = geometry.boundingBox.max,
      min = geometry.boundingBox.min;
    var offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    var range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    var faces = geometry.faces;

    geometry.faceVertexUvs[0] = [];
    for (var i = 0; i < faces.length; i++) {
      var v1 = geometry.vertices[faces[i].a],
        v2 = geometry.vertices[faces[i].b],
        v3 = geometry.vertices[faces[i].c];

      geometry.faceVertexUvs[0].push([
        new THREE.Vector2(
          (v1.x + offset.x) / range.x,
          (v1.y + offset.y) / range.y
        ),
        new THREE.Vector2(
          (v2.x + offset.x) / range.x,
          (v2.y + offset.y) / range.y
        ),
        new THREE.Vector2(
          (v3.x + offset.x) / range.x,
          (v3.y + offset.y) / range.y
        ),
      ]);
    }
    geometry.uvsNeedUpdate = true;

    dots.forEach(d => {
      geometry.vertices.push(
        new THREE.Vector3(d[0], d[1], Math.random() * 200)
      );
    });

    for (var i = 0; i < triangles.length; i = i + 3) {
      var face = new THREE.Face3(
        triangles[i],
        triangles[i + 1],
        triangles[i + 2]
      );
      geometry.faces.push(face);
    }

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
  });
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  renderer.render(scene, camera);
}

init();
animate();
