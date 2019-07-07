precision mediump float;

varying vec2 v_TexCoord;
varying vec3 v_Normal;
varying float v_Color;


uniform vec3  u_lightDirection;

void main(){
   

    float dotValue = dot( normalize(v_Normal), normalize( u_lightDirection * -1.0));
    if (dotValue < 0.0) {
        dotValue = 0.0;
    }

    dotValue += 0.2;
    
    gl_FragColor =  vec4(  dotValue,  dotValue, dotValue * 0.2 , 1.0);
}