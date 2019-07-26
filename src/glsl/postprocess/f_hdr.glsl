precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_TexCoord;

void main(){
    float exposure = 0.6;
    vec3 texture = texture2D(u_texture, vec2( v_TexCoord.x,  v_TexCoord.y )).rgb;
    // vec3 mapped = texture / (texture + vec3(1.0));
    vec3 mapped = vec3(1.0) - exp(-texture * exposure);
    gl_FragColor = vec4( mapped, 1);
}