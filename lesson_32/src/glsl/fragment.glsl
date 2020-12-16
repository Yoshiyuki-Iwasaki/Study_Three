uniform sampler2D uSampler;
uniform sampler2D uTextureOne;
uniform sampler2D uTextureTwo;
varying vec2 vTextureCoord;
uniform mat3 mappedMatrix;
uniform vec2 uvAspect;
uniform float uTime;
uniform float uProgress;

mat2 rotate(float a) {
	float s = sin(a);
	float c = cos(a);
	return mat2(c, -s, s, c);
}

void main(){
    vec3 map = vec3(vTextureCoord.xy,1.)*mappedMatrix;
    float time = abs(sin(uTime));
    vec2 uv = (map.xy - 0.5)*uvAspect + 0.5;

    float progress = fract(uProgress);

    vec2 uvDivided = fract(uv*vec2(50.,1.));
    vec2 uvDisplaced = uv + rotate(3.14159264/4.)*uvDivided*progress*0.1;
    vec2 uvDisplaced01 = uv + rotate(3.14159264/4.)*uvDivided*(1. - progress)*0.1;


    vec4 im1 = texture2D(uTextureOne,uvDisplaced);
    vec4 im2 = texture2D(uTextureTwo,uvDisplaced01);
    gl_FragColor = mix(im1,im2,progress);
}