uniform float time;
uniform float progress;
uniform float speed;
uniform vec2 mouse;
uniform sampler2D image;
uniform vec4 resolution;
varying vec2 vUv;

void main(){
    float mouseDist = length(vUv - mouse);
    float normSpeed = clamp(speed*8., 0., 1.);
    float c = smoothstep(0.11, 0., mouseDist);
    vec2 newUV = vUv*resolution.z;

    float r = texture2D(image,newUV + 0.7*c*normSpeed).r;
    float g = texture2D(image,newUV + 0.5*c*normSpeed).g;
    float b = texture2D(image,newUV + 0.3*c*normSpeed).b;


    gl_FragColor = vec4(c*mouseDist,0.,0.,1.0);
    gl_FragColor = vec4(r,g,b,1.0);
}