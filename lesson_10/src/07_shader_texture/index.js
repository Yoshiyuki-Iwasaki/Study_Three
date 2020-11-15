import Canvas from './Canvas';

export default class Page07 {
  constructor() {
    const canvas = new Canvas();

    window.addEventListener('mousemove', e => {
      canvas.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener('mouseover', e => {
      canvas.mousePressed(e.clientX, e.clientY);
    });
    window.addEventListener('mouseout', e => {
      canvas.mouseReleased(e.clientX, e.clientY);
    });
  }
};