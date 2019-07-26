precision mediump float;


uniform sampler2D u_position;
uniform sampler2D u_normal;
uniform sampler2D u_albedo;

uniform vec3 u_lightPos;
uniform vec3 u_lightColor;
uniform vec3 u_viewPos;

varying vec2 v_TexCoord;

void main(){
    vec3 v_FragPos = texture2D(u_position, v_TexCoord).rgb;
    vec3 normal = texture2D(u_normal, v_TexCoord).rgb;
    vec3 albedo = texture2D(u_albedo, v_TexCoord).rgb;

    float ambientStrength = 0.3;
    float specularStrength = 0.5;

    vec3 ambient = ambientStrength * u_lightColor;

    vec3 lightDir = normalize(u_lightPos - v_FragPos);
    vec3 norm = normalize(normal);

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor;

    vec3 viewDir = normalize(u_viewPos - v_FragPos);
    vec3 reflectDir = reflect(-lightDir, norm); 

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);
    vec3 specular = specularStrength * spec * u_lightColor;  

    vec3 result = (ambient + diffuse + specular) * albedo;
   
    gl_FragColor =  vec4(result, 1.0);
}