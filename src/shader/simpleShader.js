let VSHADER_SOURCE = `attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute vec3 a_Color;
attribute vec2 a_TexCoord;

uniform mat4 u_vpMatrix;
uniform mat4 u_mMatrix;
uniform mat4 u_nMatrix;

varying vec2 v_TexCoord;
varying vec3 v_Normal;
varying vec3 v_FragPos; 
varying vec3 v_Color;

void main() {
   
    gl_Position = u_vpMatrix * u_mMatrix * a_Position;
    v_FragPos = vec3( u_mMatrix * a_Position );
    v_Normal =  a_Normal;  
    v_Color = a_Color;

    v_TexCoord = a_TexCoord;
   
    
}
`
let FSHADER_SOURCE = `precision mediump float;
varying vec2 v_TexCoord;
varying vec3 v_Normal;
varying vec3 v_FragPos; 
varying vec3 v_Color;

uniform vec3 u_lightPos;
uniform vec3 u_lightColor;
uniform vec3 u_viewPos;

void main(){
    vec3 objectColor = v_Color;

    float ambientStrength = 0.1;
    float specularStrength = 1.0;

    vec3 ambient = ambientStrength * u_lightColor;

    vec3 lightDir = normalize(u_lightPos - v_FragPos);
    vec3 norm = normalize(v_Normal);

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor;

    vec3 viewDir = normalize(u_viewPos - v_FragPos);
    vec3 reflectDir = reflect(-lightDir, norm); 

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);
    vec3 specular = specularStrength * spec * u_lightColor;  

    vec3 result = (ambient + diffuse + specular) * objectColor;
   
    gl_FragColor =  vec4(result, 1.0);
}
`

export { VSHADER_SOURCE, FSHADER_SOURCE }
