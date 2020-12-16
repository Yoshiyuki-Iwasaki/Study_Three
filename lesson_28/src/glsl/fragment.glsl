uniform float time;
uniform float noise;
uniform sampler2D image;
uniform sampler2D displacement;
uniform sampler2D text;
uniform vec4 resolution;

varying vec2 vUv;
uniform vec3 mouse;
varying vec3 vPosition;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main(){
    vec4 displace = texture2D(displacement, vUv.yx);
    vec2 displacedUV = vec2(
        vUv.x,
        vUv.y
    );
    displacedUV.y = mix(vUv.y, displace.r - 0.1, noise);
    vec4 color = texture2D(image, displacedUV);
    color.r = texture2D(image, displacedUV + vec2(0.,15.0*0.005)*noise).r;
    color.g = texture2D(image, displacedUV + vec2(0.,15.0*0.01)*noise).g;
    color.b = texture2D(image, displacedUV + vec2(0.,15.0*0.02)*noise).b;


    // ===============

    vec2 direction = normalize(vPosition.xy - mouse.xy);
    float dist = length(vPosition - mouse);

    float prox = 1.0 - map(dist,0.0,0.2,0.0,1.0);

    prox = clamp(prox, 0.0,1.0);

    vec2 zoomedUV = vUv + direction*prox*noise;
    vec4 textImage = texture2D(text, zoomedUV);

    gl_FragColor = textImage;
    // gl_FragColor = vec4(prox,prox,prox,1.);
    // gl_FragColor = vec4(direction,0.0,1.0);
}
