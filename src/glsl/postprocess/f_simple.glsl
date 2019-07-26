precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_TexCoord;

void main(){
    vec4 texture = texture2D(u_texture, vec2( v_TexCoord.x,  v_TexCoord.y ));
    gl_FragColor = vec4( texture.x , texture.y, texture.z, 1);
}