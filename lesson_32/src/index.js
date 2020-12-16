import * as PIXI from "pixi.js";
import fragment from "./glsl/fragment.glsl";
import vertex from "./glsl/vertex.glsl";
import $ from "jquery";
import { TweenMax, Power3 } from "gsap";

let img = require("./image/img.jpg");
let img1 = require("./image/img1.jpg");
let img2 = require("./image/img2.jpg");

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  autoResize: true,
});

// The application will create a canvas element for you that you
// can then insert into the DOM.
document.body.appendChild(app.view);

let loader = PIXI.loader;
loader.add("img0", img);
loader.add("img1", img1);
loader.add("img2", img2);

let Filter;

// load the texture we need
loader.load((loader, resources) => {
  Filter = new PIXI.Filter(null, fragment);
  Filter.apply = function (filterManager, input, output, clear) {
    const matrix = new PIXI.Matrix();
    this.uniforms.mappedMatrix = filterManager.calculateNormalizedScreenSpaceMatrix(
      matrix
    );
    PIXI.Filter.prototype.apply.call(this, filterManager, input, output, clear);
  };

  // This creates a texture from a 'bunny.png' image.
  const bunny = new PIXI.Sprite(resources.img0.texture);

  // Setup the position of the bunny
  // bunny.x = app.renderer.width / 2;
  // bunny.y = app.renderer.height / 2;

  // Rotate around the center
  // bunny.anchor.x = 0.5;
  // bunny.anchor.y = 0.5;

  let winAspect = $(window).width() / $(window).height();
  let imageAspect =
    resources.img1.texture.width / resources.img1.texture.height;
  if (winAspect > imageAspect) {
    Filter.uniforms.uvAspect = { x: 1, y: imageAspect / winAspect };
  } else {
    Filter.uniforms.uvAspect = {
      x: winAspect / imageAspect,
      y: 1,
    };
  }

  bunny.filters = [Filter];

  Filter.uniforms.uTextureOne = resources.img1.texture;
  Filter.uniforms.uTextureTwo = resources.img2.texture;
  Filter.uniforms.uTime = 0;
  Filter.uniforms.uProgress = 0;
  // Add the bunny to the scene we are building.
  app.stage.addChild(bunny);

  $("a").on("mouseover", function () {
    let to = $(this).index();
    TweenMax.to(Filter.uniforms, 0.7, {
      uProgress: to,
      ease: Power3.easeInOut,
      onUpdate: () => {
        let number = Math.floor(Filter.uniforms.uProgress);
        Filter.uniforms.uTextureOne = resources[`img${number}`].texture;
        if (number < 2) {
          Filter.uniforms.uTextureTwo = resources[`img${number + 1}`].texture;
        }
      },
    });
  });

  // Listen for frame updates
  app.ticker.add(() => {
    Filter.uniforms.uTime += 0.02;
  });
});
