precision mediump float;

varying vec3 v_Normal;
varying vec3 v_FragPos; 
varying vec3 v_Color;
varying vec2 v_TexCoord;

uniform sampler2D u_texture;
uniform sampler2D u_depthTexture;
uniform vec3 u_lightPos;
uniform vec3 u_lightColor;
uniform vec3 u_viewPos;
uniform mat4 lightVPMatrix;

float ShadowCalculation(vec4 fragPosLightSpace)
{
    // perform perspective divide
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // transform to [0,1] range
    projCoords = projCoords * 0.5 + 0.5;
    // get closest depth value from light's perspective (using [0,1] range fragPosLight as coords)
    float closestDepth = texture2D(u_depthTexture , projCoords.xy).r; 
    // get depth of current fragment from light's perspective
    float currentDepth = projCoords.z;
    // check whether current frag pos is in shadow
    float shadow = currentDepth > closestDepth   ? 1.0 : 0.0;

    return shadow;
}  

void main(){
    vec4 objectColor = texture2D(u_texture, v_TexCoord);

    vec4 fromLightPos =  lightVPMatrix*vec4(v_FragPos, 1.0);

    

    
    float ambientStrength = 0.3;
    float specularStrength = 0.5;

    vec3 ambient = ambientStrength * u_lightColor;

    vec3 lightDir = normalize(u_lightPos - v_FragPos);
    vec3 norm = normalize(v_Normal);

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * u_lightColor;

    vec3 viewDir = normalize(u_viewPos - v_FragPos);
    vec3 reflectDir = reflect(-lightDir, norm); 

    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 128.0);
    vec3 specular = specularStrength * spec * u_lightColor;  

    float shadow = ShadowCalculation(fromLightPos);       
    
    vec3 result = (ambient + (1.0-shadow)*(diffuse + specular)) * vec3( objectColor);

    gl_FragColor =  vec4(result, objectColor.w);
    
}