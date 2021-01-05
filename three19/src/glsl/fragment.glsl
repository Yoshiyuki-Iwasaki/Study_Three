uniform float time;
uniform sampler2D texture1;

varying vec2 vUv;
varying vec3  vv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vNoise;

void main(){
    vec3 X = dFdx(vPosition);
    vec3 Y = dFdy(vPosition);
    vec3 n =normalize(cross(X,Y));
    // vec2 newUV = (vUv - vec2(0.5))*resolution.zx + vec2(0.5);
    gl_FragColor = vec4(vNormal,1.0);
    gl_FragColor = vec4(vPosition,1.0);
    gl_FragColor = vec4(n,1.0);
    // gl_FragColor = vec4(vec3(vNoise),1.0);
}