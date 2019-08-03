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
    this.size = {}
    this.dataSize = undefined
    this.buffer = {}
  }

  setTextureObject(textureName, texture) {
    this.texture[textureName] = texture
  }
  setAttribute(gl, attributeName, attributeData) {
    this.buffer[attributeName] = {}
    this.buffer[attributeName].buffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer[attributeName].buffer)
    gl.bufferData(gl.ARRAY_BUFFER, attributeData.data, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    this.buffer[attributeName].size = attributeData.size

    if (this.dataSize == undefined) {
      this.dataSize = attributeData.data.length / attributeData.size
    } else {
      if (this.dataSize != attributeData.data.length / attributeData.size) {
        console.warn('attribute data is not aligned!')
      }
    }
  }

  setTextureDataWidthHeight(gl, textureName, kind, width, height, data) {
    let texture = gl.createTexture()
    this.texture[textureName] = texture
    gl.bindTexture(gl.TEXTURE_2D, texture)

    let level = 0
    let border = 0
    let internalFormat
    let format

    let type
    if (kind == 'RGBA') {
      internalFormat = gl.RGBA
      format = gl.RGBA
      type = gl.UNSIGNED_BYTE
    } else if (kind == 'FloatRGBA') {
      internalFormat = gl.RGBA
      format = gl.RGBA
      type = gl.FLOAT
    } else {
      console.warn('kind parameter is not correct!!')
    }
    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      format,
      type,
      data
    )

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
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

  setAttributeTexture(gl, attributes, textures) {
    for (let attributeName in attributes) {
      this.setAttribute(gl, attributeName, attributes[attributeName])
    }

    for (let textureName in textures) {
      this.setTexture(gl, textureName, textures[textureName])
    }
  }
}

export { GLObject }
