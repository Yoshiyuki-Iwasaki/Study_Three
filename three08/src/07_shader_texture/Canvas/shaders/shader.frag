varying vec2 vUv;

uniform float uTime;
uniform float uPercent;
uniform sampler2D uTex;

void main(){
  float shift = uPercent * .01;

  float r = texture2D( uTex, vUv + vec2( shift, 0.0 ) ).r;
  float g = texture2D( uTex, vUv ).g;
  float b = texture2D( uTex, vUv - vec2( shift, 0.0 ) ).b;

  vec3 color = vec3( r, g, b );

  gl_FragColor = vec4( color, 1.0 );
}