precision mediump float;

uniform sampler2D u_texture;
uniform sampler2D u_texture2;
uniform float ww;
uniform float wh;
uniform float type;


void main(){
    vec4 texture = texture2D(u_texture, vec2( gl_FragCoord.x/ww,  gl_FragCoord.y/wh ));
    vec4 texture2 = texture2D(u_texture2, vec2( gl_FragCoord.x/ww,  gl_FragCoord.y/wh ));
    
    if(type == 1.0){
        // matrix add
        gl_FragColor = vec4(texture.x + texture2.x , texture.y + texture2.y, texture.z + texture2.z, 1);
    } else if(type == 2.0) {
        // matrix multiplication
        float sum = 0.0;
        for(float i=0.0;i<3.0;i++){
            float pic = i + 0.5; 
            vec4 tex1 = texture2D(u_texture, vec2( pic/ww,  gl_FragCoord.y/wh ));
            vec4 tex2 = texture2D(u_texture2, vec2( gl_FragCoord.x/ww,  pic/wh ));
            sum += tex1.x * tex2.x;
        }
        gl_FragColor = vec4(sum , 0.0, 0.0, 1);
    }
    
}