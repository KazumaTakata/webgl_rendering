attribute vec4 a_Position;
attribute vec3 a_Normal;
attribute float a_Color;
varying float v_Color;
varying vec3 v_Normal;
uniform mat4 u_vpMatrix;
uniform mat4 u_mMatrix;
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;
void main() {
    gl_Position = u_vpMatrix * u_mMatrix * a_Position;
    v_TexCoord = a_TexCoord;
    v_Color = a_Color;
    v_Normal = a_Normal;
}
