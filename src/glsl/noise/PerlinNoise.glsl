precision mediump float;

uniform sampler2D u_texture;
varying vec2 v_TexCoord;

float rand(float n){return fract(sin(n) * 43758.5453123);}

float rand2d(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453) - 0.5;
}

float rand2d2(vec2 n) { 
	return fract(sin(dot(n, vec2(140.9898, 14.1414))) * 11358.5453) - 0.5;
}

float cubicHermine(float f){
    return f*f*(3.0-2.0*f);
}

float cubicHermine2(float f){
    return f*f*f*(6.0*f*f - 15.0*f + 10.0);
}

void main(){
    float gridSize = 10.0;
   
    float grid_x = floor(v_TexCoord.x * gridSize);
    float grid_y = floor(v_TexCoord.y * gridSize);


    float frac_x = fract(v_TexCoord.x * gridSize);
    float frac_y = fract(v_TexCoord.y * gridSize);
    float herm_x = cubicHermine(fract(v_TexCoord.x * gridSize));
    float herm_y = cubicHermine(fract(v_TexCoord.y * gridSize));

    
    vec2 grad1 = normalize( vec2( rand2d(vec2(grid_x, grid_y)),  rand2d2(vec2(grid_x, grid_y)))) ; 
    vec2 grad2 = normalize( vec2( rand2d(vec2(grid_x + 1.0, grid_y)),  rand2d2(vec2(grid_x + 1.0, grid_y))));
    vec2 grad3 = normalize( vec2( rand2d(vec2(grid_x, grid_y + 1.0)),  rand2d2(vec2(grid_x, grid_y + 1.0))));
    vec2 grad4 = normalize( vec2( rand2d(vec2(grid_x + 1.0, grid_y + 1.0)),  rand2d2(vec2(grid_x + 1.0, grid_y + 1.0))));

    float prod1 = dot(grad1,vec2(frac_x,frac_y));
    float prod2 = dot(grad2,vec2( -1.0*( 1.0 - frac_x ),frac_y));
    float prod3 = dot(grad3,vec2(frac_x,-1.0*(1.0 - frac_y)));
    float prod4 = dot(grad4,vec2(-1.0*(1.0 - frac_x),-1.0*( 1.0 - frac_y )));

    float sum = herm_x * herm_y  * prod4 + 
                (1.0 - herm_x) * herm_y  * prod3 + 
                herm_x * (1.0 - herm_y) * prod2 + 
                (1.0 - herm_x) * (1.0 - herm_y) * prod1;

    vec3 noise = vec3(sum * 0.5 +0.5);
    

    gl_FragColor = vec4(noise, 1.0);
   
   
}