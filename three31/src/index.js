let speed = 0;
let position = 0;

window.addEventListener("wheel", e => {
  speed += e.deltaY * 0.0002;
});

function raf() {
  console.log(position);
  position += speed;
  speed *= 0.8;
  window.requestAnimationFrame(raf);
}

raf();
