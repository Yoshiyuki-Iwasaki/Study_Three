varying vec2 vUv;

uniform float uTime;
uniform float uPercent;
uniform vec2 uResolution;
uniform sampler2D uTex;

float random2d(vec2 coord){
  return fract(sin(dot(coord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
  vec2 coord = gl_FragCoord.xy / uResolution;
  float shift = uPercent * -.013;
  float noise = (random2d(coord) - 0.5);

  float r = texture2D( uTex, vUv + vec2( 0, shift ) ).r;
  float g = texture2D( uTex, vUv ).g;
  float b = texture2D( uTex, vUv - vec2( 0, shift ) ).b;

  vec3 color = vec3( r, g, b);

  gl_FragColor = vec4( color, 1.0 );
}