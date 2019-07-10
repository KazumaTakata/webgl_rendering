precision mediump float;

uniform sampler2D u_texture;



varying vec2 v_TexCoord;


void main(){
    float red =  texture2D(u_texture, vec2( v_TexCoord.x,  v_TexCoord.y )).r; 
    gl_FragColor = vec4(red, red, red, 1);
}