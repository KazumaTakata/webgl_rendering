precision highp float;

uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform float ww;
uniform float wh;
uniform float type;
float d = 1./ww, dth2 = .2;

// http://hplgit.github.io/num-methods-for-PDEs/doc/pub/wave/pdf/wave-4print-A4-2up.pdf
void main(void) {
if (type==1.0){    
    if ( gl_FragCoord.x == 0.5 ||  gl_FragCoord.y == 0.5 ||  gl_FragCoord.x == ww - 0.5  || gl_FragCoord.y == wh - 0.5 ){
        gl_FragColor = vec4(0, 0., 0., 0. );
    } else {
   float u = texture2D(u_texture0, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh)).r;
   float u1  = texture2D(u_texture1, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh)).r;
   u = 2.*u1 - u +
     (texture2D(u_texture1, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh + d) ).r +
      texture2D(u_texture1, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh - d) ).r +
      texture2D(u_texture1, vec2(gl_FragCoord.x/ww + d, gl_FragCoord.y/wh) ).r +
      texture2D(u_texture1, vec2(gl_FragCoord.x/ww - d, gl_FragCoord.y/wh) ).r +
      - 4.*u1)*dth2;
   gl_FragColor = vec4(u, 0., 0., 0. );

    }
} else if (type==0.0) {
     if ( gl_FragCoord.x == 0.5 ||  gl_FragCoord.y == 0.5 ||  gl_FragCoord.x == ww - 0.5  || gl_FragCoord.y == wh - 0.5 ){
        gl_FragColor = vec4(0, 0., 0., 0. );
    } else {
   float u1  = texture2D(u_texture1, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh)).r;
   float u = u1  +
     (texture2D(u_texture1, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh + d) ).r +
      texture2D(u_texture1, vec2(gl_FragCoord.x/ww, gl_FragCoord.y/wh - d) ).r +
      texture2D(u_texture1, vec2(gl_FragCoord.x/ww + d, gl_FragCoord.y/wh) ).r +
      texture2D(u_texture1, vec2(gl_FragCoord.x/ww - d, gl_FragCoord.y/wh) ).r +
      - 4.*u1)*dth2 * 1.0/2.0;
   gl_FragColor = vec4(u, 0., 0., 0. );
    }
} else if (type == 2.0) {
    vec4 texture = texture2D(u_texture0, vec2( gl_FragCoord.x/ww,  gl_FragCoord.y/wh ));
    gl_FragColor = vec4( texture.x + 0.5   , texture.x + 0.5 , texture.x + 0.5 , 1);
}
}