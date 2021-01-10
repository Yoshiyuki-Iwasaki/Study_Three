uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;

uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vNormal;
// varying vec4 vPosition;

void main(){
    vec2 newUV = (vUv - vec2(0.5))*resolution.zx + vec2(0.5);
    float dist = length(gl_PointCoord - vec2(0.5));

    gl_FragColor = vec4(vUv,0.0,1.0);
    gl_FragColor = vec4(vNormal,1.0);
    gl_FragColor = vec4(dist,dist,1.0,1.0);
}