import { Matrix4 } from '../lib/cuon-matrix'

class GLObject {
  constructor() {
    this.position = undefined
    this.normal = undefined
    this.textureCord = undefined
    this.positionBuffer = undefined
    this.normalBuffer = undefined
    this.textureCordBuffer = undefined
    this.ModelPosition = { x: 0, y: 0, z: 0 }
    this.ModelRotation = { x: 0, y: 0, z: 0 }
    this.ModelMatrix = new Matrix4()
    this.texture = {}
    this.size = undefined
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
    if (this.normal != undefined) {
      if (this.normalBuffer == undefined) {
        this.normalBuffer = gl.createBuffer()
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.normal, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
  }
  setTextureCord(gl, textureCord) {
    this.textureCord = textureCord
    if (this.textureCord != undefined) {
      if (this.textureCordBuffer == undefined) {
        this.textureCordBuffer = gl.createBuffer()
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCordBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, this.textureCord, gl.STATIC_DRAW)
      gl.bindBuffer(gl.ARRAY_BUFFER, null)
    }
  }

  setTexture(gl, textureName, textureFileName) {
    let img = window.images[textureFileName]
    let texture = gl.createTexture()
    this.texture[textureName] = texture

    gl.bindTexture(gl.TEXTURE_2D, texture)

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    // https://gamedev.stackexchange.com/a/140791
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
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

  setAll(gl, position, normal, textureCord, size, texture) {
    this.setPosition(gl, position)
    this.setNormal(gl, normal)
    this.setTextureCord(gl, textureCord)
    for (let textureName in texture) {
      this.setTexture(gl, textureName, texture[textureName])
    }

    this.size = size
  }
}

export { GLObject }
