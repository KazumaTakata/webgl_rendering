#extension GL_EXT_draw_buffers : require

precision mediump float;

varying vec3 v_FragPos; 
varying vec2 v_TexCoord;
varying mat3 TBN;


uniform sampler2D u_texture;
uniform sampler2D u_normal;
uniform vec3 u_lightPos;
uniform vec3 u_lightColor;
uniform vec3 u_viewPos;


void main(){
    
    vec3 objectColor = texture2D(u_texture, v_TexCoord).rgb;
    vec3 objectNormal = texture2D(u_normal, v_TexCoord).rgb;

    vec3 norm = normalize(objectNormal * 2.0 - 1.0);
    norm = TBN * norm;

    
   
    gl_FragData[0] =  vec4(v_FragPos, 1.0);
    gl_FragData[1] =  vec4(norm, 1.0);
    gl_FragData[2] =  vec4(objectColor, 1.0);
}