import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VNOISE_SHADER_SOURCE from 'glsl/noise/v_shader.glsl'
import FNOISE_SHADER_SOURCE from 'glsl/noise/PerlinNoise.glsl'
import { verticesTexCoords } from 'object/image'
import { cubeData } from 'object/cube'
import { GLObject } from 'object/object'
import { GLProgram } from 'shader/program'
import { GLScene } from 'scene/scene'
import { parsedData } from 'loader/objLoader'
import TextureSrc from 'loader/sample/texture/sample.png'
import { InitEnv } from 'util/init'

let scene

InitEnv('webgl', [TextureSrc], main)

function main(canvasId) {
  let canvas = document.getElementById(canvasId)
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element')
  }
  scene = new GLScene(canvas)
  start()
}

let theta = 2
let phi = 1.5
let rho = 20

function start() {
  let program = createProgram(
    scene.gl,
    VNOISE_SHADER_SOURCE,
    FNOISE_SHADER_SOURCE
  )
  let glprogram = new GLProgram(program)

  scene.setProgram('noise', glprogram)
  scene.useProgram('noise')

  let image = new GLObject()
  image.setAll(
    scene.gl,
    verticesTexCoords.positions,
    verticesTexCoords.normals,
    verticesTexCoords.textureCord,
    { posSize: 2, texSize: 2 },
    {}
  )

  scene.addObject('image', image)

  scene.clear()
  scene.drawPlane()

  //   window.requestAnimationFrame(draw)
}

function draw(timestamp) {
  scene.clear()
  scene.drawPlane()
  window.requestAnimationFrame(draw)
}
