import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VSHADER_SOURCE from 'glsl/gpgpu/v_simple.glsl'
import FSHADER_SOURCE from 'glsl/gpgpu/f_wave_update.glsl'
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

  let program2 = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram2 = new GLProgram(program2)
  scene.setProgram('image', glprogram2)

  //   scene.gl.pixelStorei(scene.gl.UNPACK_ALIGNMENT, 1)

  let image = new GLObject()
  let attributeData = {
    Position: { data: verticesTexCoords.positions, size: 2 },
    Texcoord: { data: verticesTexCoords.textureCord, size: 2 }
  }

  let outWidth = 200
  let outHeight = 200

  let data = new Float32Array(outWidth * outHeight * 4)

  for (let i = 0; i < outWidth * outHeight * 4; i++) {
    if (i % 4 == 0) {
      let x = (i / 4) % outWidth
      let y = i / 4 / outWidth
      let center = { x: 100, y: 100 }
      length = (center.x - x) * (center.x - x) + (center.y - y) * (center.y - y)
      data[i] = Math.exp(-length / 200) * 3
    } else {
      data[i] = 0
    }
  }

  image.setTextureDataWidthHeight(
    scene.gl,
    'u_texture0',
    'FloatRGBA',
    outWidth,
    outHeight,
    data
  )

  image.setAttributeTexture(scene.gl, attributeData, {})

  scene.addObject('image', image)

  scene.targetTexture['texture1'] = image.texture['u_texture0']
  scene.createTargetTexture('texture0', outWidth, outHeight, 'floatColor')
  scene.createTargetTexture('texture2', outWidth, outHeight, 'floatColor')

  let textures = ['texture0', 'texture1', 'texture2']

  let viewWidth = 400
  let viewHeight = 400

  let i = 0

  requestAnimationFrame(draw)
  function draw() {
    // scene.useProgram('simple')
    if (i == 0) {
      scene.addUniform1f('type', 0)
    } else {
      scene.addUniform1f('type', 1)
    }
    scene.bindFrambufferAndSetViewport(outWidth, outHeight)
    scene.addUniform1f('ww', outWidth)
    scene.addUniform1f('wh', outHeight)

    image.setTextureObject('u_texture0', scene.targetTexture[textures[0]])
    image.setTextureObject('u_texture1', scene.targetTexture[textures[1]])

    scene.attachTargetTextureToFrameBufferAttachment(
      textures[2],
      scene.gl.COLOR_ATTACHMENT0
    )

    scene.clear()
    scene.drawPlane()

    // view update
    scene.unbindFrambufferAndSetViewport(viewWidth, viewHeight)
    // scene.useProgram('image')
    scene.addUniform1f('ww', viewWidth)
    scene.addUniform1f('wh', viewHeight)
    scene.addUniform1f('type', 2)

    image.setTextureObject('u_texture0', scene.targetTexture[textures[2]])

    scene.clear()
    scene.drawPlane()

    textures = [textures[1], textures[2], textures[0]]
    i++
    requestAnimationFrame(draw)
  }
}
