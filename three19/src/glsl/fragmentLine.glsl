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


    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}