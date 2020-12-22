precision highp float;
precision highp int;
attribute vec3 position;
attribute vec3 normal;
attribute vec3 offset;
attribute vec3 random;
attribute vec3 color;
attribute vec2 textureCoord;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vNormal;
uniform sampler2D uStart;
uniform sampler2D uEnd;
uniform float uTransition;
varying vec3 vColor;
varying float vAlpha;
void main() {
    vColor = color;
    vec3 pos = position + offset;
    pos.z = random.z * 0.05;
    float uStartAlpha = step(0.5,texture2D(uStart, textureCoord).r);
    float uEndAlpha = step(0.5,texture2D(uEnd, textureCoord).r);
    float show = max(uStartAlpha,uEndAlpha);
    vAlpha = show*mix(uStartAlpha,uEndAlpha,uTransition);

    // rotate
    vec2 origin = textureCoord.xy*vec2(1.,0.5);
    // pos.xy += origin - vec2(0.5,0.5);

    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}