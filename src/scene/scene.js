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
    // this.objects = {}
    this.cameraPosition = undefined
    this.targetPosition = undefined
    this.targetTexture = {}
    this.fb = this.gl.createFramebuffer()
    this.vpMatrix = undefined
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

  addObject(name, object) {
    this.activeProgram.objects[name] = object
    // this.objects[name] = object
  }

  removeObject(name) {
    // delete this.objects[name]
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
    for (let objectName in this.activeProgram.objects) {
      let dataLength = this.activeProgram.objects[objectName].dataSize
      this.bindUniform(objectName)
      this.bindAttribute(objectName)

      this.gl.drawArrays(this.gl.TRIANGLES, 0, dataLength)
    }
  }

  drawPlane() {
    for (let objectName in this.activeProgram.objects) {
      this.bindUniform(objectName)
      this.bindAttribute(objectName)
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
    }
  }

  setPerspectiveCamera(cameraPosition, targetPosition, aspect) {
    var vpMatrix = new Matrix4()
    this.cameraPosition = cameraPosition
    this.targetPosition = targetPosition
    vpMatrix.setPerspective(30, aspect, 1, 100)
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

    this.vpMatrix = vpMatrix
    this.activeProgram.setUniformMatrix4fv(
      this.gl,
      'u_vpMatrix',
      vpMatrix.elements
    )

    this.setViewPos()
  }

  bindFrambufferAndSetViewport(width, height) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb)
    this.gl.viewport(0, 0, width, height)
  }

  unbindFrambufferAndSetViewport(width, height) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.viewport(0, 0, width, height)
  }

  addDepthRenderBuffer(width, height) {
    const depthBuffer = this.gl.createRenderbuffer()
    this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, depthBuffer)

    // make a depth buffer and the same size as the targetTexture
    this.gl.renderbufferStorage(
      this.gl.RENDERBUFFER,
      this.gl.DEPTH_COMPONENT16,
      width,
      height
    )
    this.gl.framebufferRenderbuffer(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.RENDERBUFFER,
      depthBuffer
    )
  }

  attachTargetTextureToFrameBuffer(targetName, attachmentPoint) {
    if (attachmentPoint == 'color' || attachmentPoint == 'floatColor') {
      attachmentPoint = this.gl.COLOR_ATTACHMENT0
    } else if (attachmentPoint == 'depth') {
      attachmentPoint = this.gl.DEPTH_ATTACHMENT
    }

    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      attachmentPoint,
      this.gl.TEXTURE_2D,
      this.targetTexture[targetName],
      0
    )
  }

  createTargetTexture(name, width, height, kind) {
    this.targetTexture[name] = this.gl.createTexture()
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture[name])

    let level = 0
    let border = 0
    let internalFormat
    let format
    let data = null
    let type
    if (kind == 'color') {
      internalFormat = this.gl.RGBA
      format = this.gl.RGBA
      type = this.gl.UNSIGNED_BYTE
    } else if (kind == 'floatColor') {
      internalFormat = this.gl.RGBA
      format = this.gl.RGBA
      type = this.gl.FLOAT
    } else if (kind == 'depth') {
      internalFormat = this.gl.DEPTH_COMPONENT
      format = this.gl.DEPTH_COMPONENT
      type = this.gl.UNSIGNED_SHORT
    } else {
      console.warn('kind parameter is not correct!!')
    }
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      data
    )

    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE
    )
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE
    )
  }

  addUniform1f(name, value) {
    this.activeProgram.setUniform1f(this.gl, name, value)
  }

  bindUniform(objectName) {
    this.activeProgram.setUniformMatrix4fv(
      this.gl,
      'u_mMatrix',
      this.activeProgram.objects[objectName].ModelMatrix.elements
    )

    let index = 0

    for (let textureName in this.activeProgram.objects[objectName].texture) {
      let diffTextureLocation = this.gl.getUniformLocation(
        this.activeProgram.program,
        textureName
      )
      this.gl.uniform1i(diffTextureLocation, index)
      this.gl.activeTexture(this.gl.TEXTURE0 + index)
      this.gl.bindTexture(
        this.gl.TEXTURE_2D,
        this.activeProgram.objects[objectName].texture[textureName]
      )
      index++
    }
  }

  bindAttribute(name) {
    for (let bufferName in this.activeProgram.objects[name].buffer) {
      let attributeName = 'a_' + bufferName
      this.activeProgram.setAttribute(
        this.gl,
        this.activeProgram.objects[name].buffer[bufferName].buffer,
        this.activeProgram.objects[name].buffer[bufferName].size,
        attributeName
      )
    }
  }
}

export { GLScene }
