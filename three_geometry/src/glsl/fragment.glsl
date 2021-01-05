uniform sampler2D textureSampler;
varying vec2 vUv;
varying vec3 v_position;

void main(){
    vec4 image = texture2D(textureSampler,vUv);
    vec3 normal = normalize(cross(dFdx(v_position),dFdy(v_position)));
    gl_FragColor = vec4(normal,1.0);
}