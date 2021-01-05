uniform vec2 u_resolution;
uniform float u_time;
vec2 stepVec2(vec2 a, float v) {
return vec2(step(a.x, v), step(a.y, v));
}
vec2 fracVec2(vec2 v) {
return vec2(fract(v.x), fract(v.y));
}
float wave(vec2 st, float n) {
st = (floor(st * n) + 0.5) / n;
float d = distance(vec2(0.5, 0.5), st);
return (1.0 + sin(d * 3.0 - u_time)) * 0.5;
}
float box(vec2 st, float size) {
size = 0.5 + size * 0.5;
st = stepVec2(st, size) * stepVec2(1.0 - st, size);
return st.x * st.y;
}
void main() {
vec2 st = gl_FragCoord.xy/u_resolution.xy;
float n = 100.0;
vec2 xy = fracVec2(st.xy * n);
float size = wave(st.xy, n);
float ret = box(xy, size);
gl_FragColor = vec4(ret, ret, ret, 1);
}