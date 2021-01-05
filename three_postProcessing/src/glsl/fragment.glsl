uniform float time;
uniform float progress;
uniform sampler2D image;
uniform sampler2D texture2;



varying vec2 vUv;
// varying vec4 vPosition;

void main(){
    gl_FragColor = texture2D(image,vUv);
}