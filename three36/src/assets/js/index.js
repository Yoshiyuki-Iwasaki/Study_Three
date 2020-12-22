let speed = 0;
let position = 0;
let rounded = 0;
let block = document.getElementById("block");
window.addEventListener("wheel", e => {
  speed += e.deltaY * 0.003;
});

function raf() {
  position += speed;
  speed *= 0.8;

  rounded = Math.round(position);

  let diff = rounded - position;

  position += diff * 0.05;

  block.style.transform = `translate(0,${position * 100}px`;
  window.requestAnimationFrame(raf);
}

raf();
