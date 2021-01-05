uniform float time;
uniform float move;
varying vec2 vUv;
varying vec2 vCoordinates;
attribute vec3 aCoordinates;
attribute float aSpeed;
attribute float aOffset;

void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z = position.z + move*aSpeed + aOffset;

    vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
    gl_PointSize = 1000. * (1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;

    vCoordinates = aCoordinates.xy;
}