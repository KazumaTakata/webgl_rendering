import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from '../lib/cuon-utils'

import { Matrix4 } from '../lib/cuon-matrix'

class GLScene {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = getWebGLContext(canvas)
    this.programs = {}
    this.activeProgram = undefined
    this.objects = {}
    this.cameraPosition = undefined
  }

  setProgram(name, program) {
    this.programs[name] = program
  }

  useProgram(name) {
    useProgram(this.gl, this.programs[name].program)
    this.activeProgram = this.programs[name]
  }

  defaultSetting() {
    this.gl.enable(this.gl.DEPTH_TEST)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  addObject(name, globject) {
    this.objects[name] = globject
  }

  setDirectionalLight(x, y, z) {
    let lightDirection = new Float32Array([-x, -y, -z])
    this.activeProgram.setUniform3fv(
      this.gl,
      'u_lightDirection',
      lightDirection
    )
  }
  setLightPos(x, y, z) {
    let lightPos = new Float32Array([x, y, z])
    this.activeProgram.setUniform3fv(this.gl, 'u_lightPos', lightPos)
  }

  setLightColor(r, g, b) {
    let lightColor = new Float32Array([r, g, b])
    this.activeProgram.setUniform3fv(this.gl, 'u_lightColor', lightColor)
  }

  setViewPos() {
    let viewPos = new Float32Array([
      this.cameraPosition.x,
      this.cameraPosition.y,
      this.cameraPosition.z
    ])
    this.activeProgram.setUniform3fv(this.gl, 'u_viewPos', viewPos)
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
  }

  draw() {
    for (let objectName in this.objects) {
      let dataLength = this.objects[objectName].position.length / 3
      this.activeProgram.setUniformMatrix4fv(
        this.gl,
        'u_mMatrix',
        this.objects[objectName].ModelMatrix.elements
      )

      this.bindAttribute(objectName)

      this.gl.drawArrays(this.gl.TRIANGLES, 0, dataLength)
    }
  }

  setPerspectiveCamera(cameraPosition, targetPosition) {
    var vpMatrix = new Matrix4()
    this.cameraPosition = cameraPosition
    vpMatrix.setPerspective(30, 1, 1, 100)
    vpMatrix.lookAt(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
      targetPosition.x,
      targetPosition.y,
      targetPosition.z,
      0,
      1,
      0
    )
    this.activeProgram.setUniformMatrix4fv(
      this.gl,
      'u_vpMatrix',
      vpMatrix.elements
    )
  }

  bindAttribute(name) {
    this.activeProgram.setAttribute(
      this.gl,
      this.objects[name].positionBuffer,
      3,
      'a_Position'
    )
    this.activeProgram.setAttribute(
      this.gl,
      this.objects[name].normalBuffer,
      3,
      'a_Normal'
    )
    this.activeProgram.setAttribute(
      this.gl,
      this.objects[name].colorBuffer,
      3,
      'a_Color'
    )
  }
}

export { GLScene }
