uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;

void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    vec4 mvPosition = modelViewMatrix * vec4(position,1.0);
    gl_PointSize = 10. * (1./ - mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
