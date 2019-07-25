precision mediump float;

varying vec3 v_Normal;
varying vec3 v_FragPos; 
varying vec3 v_Color;
varying vec2 v_TexCoord;
varying mat3 TBN;


uniform sampler2D u_texture;
uniform sampler2D u_normal;
uniform vec3 u_lightPos;
uniform vec3 u_lightColor;
uniform vec3 u_viewPos;


void main(){
    
    vec4 objectColor = texture2D(u_texture, v_TexCoord);
    vec3 objectNormal = texture2D(u_normal, v_TexCoord).rgb;

    float ambientStrength = 0.3;
    float specularStrength = 0.5;

    vec3 ambient = ambientStrength * u_lightColor;

    vec3 lightDir = normalize(u_lightPos - v_FragPos);
    vec3 norm = normalize(objectNormal * 2.0 - 1.0);
    norm = TBN * norm;

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor;

    vec3 viewDir = normalize(u_viewPos - v_FragPos);
    vec3 reflectDir = reflect(-lightDir, norm); 

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);
    vec3 specular = specularStrength * spec * u_lightColor;  

    vec3 result = (ambient + diffuse + specular) * vec3( objectColor);
   
    gl_FragColor =  vec4(result, objectColor.w);
}