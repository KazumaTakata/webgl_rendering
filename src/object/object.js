import { Matrix4 } from '../lib/cuon-matrix'

class GLObject {
  constructor() {
    this.position = undefined
    this.normal = undefined
    this.color = undefined
    this.positionBuffer = undefined
    this.normalBuffer = undefined
    this.colorBuffer = undefined
    this.ModelPosition = { x: 0, y: 0, z: 0 }
    this.ModelRotation = { x: 0, y: 0, z: 0 }
    this.ModelMatrix = new Matrix4()
  }

  setPosition(gl, position) {
    this.position = position
    if (this.positionBuffer == undefined) {
      this.positionBuffer = gl.createBuffer()
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.position, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
  setNormal(gl, normal) {
    this.normal = normal
    if (this.normalBuffer == undefined) {
      this.normalBuffer = gl.createBuffer()
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.normal, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }
  setColor(gl, color) {
    this.color = color
    if (this.color != undefined) {
      if (this.colorBuffer == undefined) {
        this.colorBuffer = gl.createBuffer()
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.color, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
  }

  setModelPosition(x, y, z) {
    this.ModelPosition = { x: x, y: y, z: z }
    this.ModelMatrix = new Matrix4()
    this.ModelMatrix.setTranslate(
      this.ModelPosition.x,
      this.ModelPosition.y,
      this.ModelPosition.z
    )
  }

  setModelRotation(x, y, z) {
    this.ModelRotation = { x: x, y: y, z: z }
    this.ModelMatrix = new Matrix4()
    this.ModelMatrix.setTranslate(
      this.ModelRotation.x,
      this.ModelRotation.y,
      this.ModelRotation.z
    )
  }

  setModelMatrix(gl) {}

  setAll(gl, position, normal, color) {
    this.setPosition(gl, position)
    this.setNormal(gl, normal)
    this.setColor(gl, color)
  }
}

export { GLObject }
