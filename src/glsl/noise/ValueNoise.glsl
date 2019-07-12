precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_TexCoord;

float rand(float n){return fract(sin(n) * 43758.5453123);}

float rand2d(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float rand2d2(vec2 n) { 
	return fract(sin(dot(n, vec2(21.9898, 14.1414))) * 4758.5453);
}

float cubicHermine(float f){
    return f*f*(3.0-2.0*f);
}


void main(){
    float gridSize = 10.0;
   
    float grid_x = floor(v_TexCoord.x * gridSize);
    float grid_y = floor(v_TexCoord.y * gridSize);

    float frac_x = cubicHermine(fract(v_TexCoord.x * gridSize));
    float frac_y = cubicHermine(fract(v_TexCoord.y * gridSize));

    
    float grad1 = rand2d2(vec2(grid_x, grid_y));
    float grad2 = rand2d2(vec2(grid_x + 1.0 , grid_y + 0.0 ));
    float grad3 = rand2d2(vec2(grid_x + 0.0 , grid_y + 1.0 ));
    float grad4 = rand2d2(vec2(grid_x + 1.0 , grid_y + 1.0 ));

    float sum = frac_x * frac_y  * grad4 + 
                (1.0 - frac_x) * frac_y  * grad3 + 
                frac_x * (1.0 - frac_y) * grad2 + 
                (1.0 - frac_x) * (1.0 - frac_y) * grad1;
    

    gl_FragColor = vec4(sum, sum, sum, 1.0);
   
   
}