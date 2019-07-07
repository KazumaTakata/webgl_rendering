import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from './lib/cuon-utils'
import { Matrix4 } from './lib/cuon-matrix'
import { RenderObject } from './util'
import { VSHADER_SOURCE, FSHADER_SOURCE } from './shader/simpleShader'
import { cubeData } from './object/cube'

let x_length = 50
let y_length = 50

// let colorsData = createColorData(x_length, y_length)

let theta = 2
let cameraPosition = { x: 0, y: 3, z: 13 }
let objectPosition = { x: 0, z: 0 }
let gl
let program
let vertexNumber

function main() {
  let canvas = document.getElementById('webgl')
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element')
  }

  gl = getWebGLContext(canvas)
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL')
  }

  //   readShaderFile(gl, 'shader/f_shader.glsl', gl.FRAGMENT_SHADER)
  //   readShaderFile(gl, 'shader/v_shader.glsl', gl.VERTEX_SHADER)
  start()

  document.addEventListener('keydown', keyPress)
}

main()

function keyPress(key) {
  console.log(key)

  switch (event.key) {
    case 'ArrowLeft':
      // Left pressed
      theta -= 0.1
      break
    case 'ArrowRight':
      // Right pressed
      theta += 0.1
      break
    case 'ArrowUp':
      // Up pressed
      break
    case 'ArrowDown':
      // Down pressed
      break
  }

  drawElement()
}

function start() {
  program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE)
  useProgram(gl, program)
  gl.enable(gl.DEPTH_TEST)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let MMatrix = new Matrix4()
  MMatrix.setTranslate(-0.5, -0.5, -0.5)

  let floor = new RenderObject(
    program,
    {
      a_Position: cubeData.positions,
      a_Normal: cubeData.normals
    },
    MMatrix
  )

  floor.bindBuffer('a_Position', 3, 3, 0, gl)
  floor.bindBuffer('a_Normal', 3, 3, 0, gl)

  vertexNumber = cubeData.positions.length / 3

  let lightDirection = new Float32Array([-2.5, -1.5, -0.5])

  let c_time = Date.now()
  floor.setUniform1f('u_time', c_time, gl)
  floor.setUniform3f('u_lightDirection', lightDirection, gl)
  floor.setUniformMatrix4fv('u_mMatrix', floor.MMatrix.elements, gl)

  drawElement()
}

function drawElement() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  var vpMatrix = createVP()
  //   mvpMatrix.translate(objectPosition.x, 0, objectPosition.z)

  setVpMatrix(vpMatrix.elements)
  //   object.setUniformMatrix4fv('u_vpMatrix', mvpMatrix.elements)

  gl.drawArrays(gl.TRIANGLES, 0, vertexNumber)
}

function setVpMatrix(val) {
  var u_val = gl.getUniformLocation(program, 'u_vpMatrix')
  gl.uniformMatrix4fv(u_val, false, val)
}

function createVP() {
  var vpMatrix = new Matrix4()

  vpMatrix.setPerspective(30, 1, 1, 100)
  vpMatrix.lookAt(4 * Math.sin(theta), 2, 4 * Math.cos(theta), 0, 0, 0, 0, 1, 0)
  return vpMatrix
}
