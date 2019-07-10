precision mediump float;

uniform sampler2D u_depthTexture;
uniform sampler2D u_texture;
uniform float mouseX;


varying vec2 v_TexCoord;


void main(){
    vec4 depth = texture2D(u_depthTexture, v_TexCoord);
    gl_FragColor = texture2D(u_texture, vec2( v_TexCoord.x +  depth.r *mouseX ,  v_TexCoord.y )); 
}