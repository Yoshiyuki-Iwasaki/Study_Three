uniform float time;
varying vec2 vUv;
varying vec3 vecPos;
varying vec3 v_position;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 pixels;
uniform vec2 uvRate1;

void main() {
    vUv = uv;
    v_position = position.xyz;
    vecPos = (modelViewMatrix*vec4(position,1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vecPos,1.0);
}