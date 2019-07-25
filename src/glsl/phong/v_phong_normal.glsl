attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec3 a_Tangent;
attribute vec3 a_Bitangent;
attribute vec2 a_Texcoord;


uniform mat4 u_vpMatrix;
uniform mat4 u_mMatrix;
uniform mat4 u_nMatrix;

varying vec2 v_TexCoord;
varying vec3 v_Normal;
varying vec3 v_FragPos; 
varying vec3 v_Color;
varying mat3 TBN;


void main() {
   
    gl_Position = u_vpMatrix * u_mMatrix * a_Position;
    v_FragPos = vec3( u_mMatrix * a_Position );
    v_Normal =  a_Normal;
    TBN = mat3(a_Tangent,a_Bitangent ,a_Normal );

    v_TexCoord = a_Texcoord;
}