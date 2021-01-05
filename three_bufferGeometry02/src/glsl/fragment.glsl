uniform float time;
uniform float progress;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
varying float vAlpha;
varying vec3 vPosition;

void main(){
    // vec2 newUV = (vUv - vec2(0.5))*resolution.zx + vec2(0.5);
    vec4 map = texture2D(uTexture,vUv);

    if(map.r<0.01) discard;

    float opacity = smoothstep(0.5, 1., length(vPosition.xy));
    gl_FragColor = map;
    gl_FragColor.a = vAlpha*opacity;
}