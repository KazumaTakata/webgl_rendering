import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VSHADER_SOURCE from 'glsl/gpgpu/v_simple.glsl'
import FSHADER_SOURCE from 'glsl/gpgpu/f_simple.glsl'
import { verticesTexCoords } from 'object/image'
import { GLObject } from 'object/object'
import { GLProgram } from 'shader/program'
import { GLScene } from 'scene/scene'
import { parsedData } from 'loader/objLoader'
import TextureSrc from './sample.jpg'

import { InitEnv } from 'util/init'

let scene

InitEnv('webgl', [TextureSrc], main)

function main(canvasId) {
  let canvas = document.getElementById(canvasId)
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element')
  }

  scene = new GLScene(canvas)

  let FloatTex = scene.gl.getExtension('OES_texture_float')

  start()
}

function start() {
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  //   scene.gl.pixelStorei(scene.gl.UNPACK_ALIGNMENT, 1)

  let image = new GLObject()
  let attributeData = {
    Position: { data: verticesTexCoords.positions, size: 2 },
    Texcoord: { data: verticesTexCoords.textureCord, size: 2 }
  }

  let outWidth = 3
  let outHeight = 3

  let data = new Float32Array(outWidth * outHeight * 4)

  for (let i = 0; i < outWidth * outHeight * 4; i++) {
    if (i % 4 == 0) {
      data[i] = i / 4
    } else {
      data[i] = 0
    }
  }

  let data2 = new Float32Array(outWidth * outHeight * 4)

  for (let i = 0; i < outWidth * outHeight * 4; i++) {
    if (i % 4 == 0) {
      data2[i] = 1
    } else {
      data2[i] = 0
    }
  }

  var t0 = performance.now()

  image.setTextureDataWidthHeight(
    scene.gl,
    'u_texture',
    'FloatRGBA',
    outWidth,
    outHeight,
    data
  )

  image.setTextureDataWidthHeight(
    scene.gl,
    'u_texture2',
    'FloatRGBA',
    outWidth,
    outHeight,
    data2
  )

  image.setAttributeTexture(scene.gl, attributeData, {})

  scene.addObject('image', image)

  scene.createTargetTexture('colorTex', outWidth, outHeight, 'floatColor')

  scene.bindFrambufferAndSetViewport(outWidth, outHeight)
  scene.addUniform1f('ww', outWidth)
  scene.addUniform1f('wh', outHeight)
  scene.addUniform1f('type', 2)

  // scene.attachTargetTextureToFrameBuffer('targetTex', 'floatColor')
  scene.attachTargetTextureToFrameBufferAttachment(
    'colorTex',
    scene.gl.COLOR_ATTACHMENT0
  )

  scene.clear()

  var t0 = performance.now()

  scene.drawPlane()

  var pixels = new Float32Array(outHeight * outWidth * 4)
  scene.gl.readPixels(
    0,
    0,
    outWidth,
    outHeight,
    scene.gl.RGBA,
    scene.gl.FLOAT,
    pixels
  )

  var t1 = performance.now()
  console.log('Call to doSomething took ' + (t1 - t0) + ' milliseconds.')

  console.log(pixels)

  let viewWidth = 400
  let viewHeight = 400
  scene.unbindFrambufferAndSetViewport(viewWidth, viewHeight)
  scene.addUniform1f('ww', viewWidth)
  scene.addUniform1f('wh', viewHeight)

  image.setTextureObject('u_texture', scene.targetTexture['colorTex'])

  scene.clear()
  scene.drawPlane()
}
