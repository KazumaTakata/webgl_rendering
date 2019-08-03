precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_texture2;
uniform float ww;
uniform float wh;
uniform float type;


void main(){
    vec4 texture = texture2D(u_texture, vec2( gl_FragCoord.x/ww,  gl_FragCoord.y/wh ));
    gl_FragColor = vec4(texture.x , texture.y , texture.z , 1);
}