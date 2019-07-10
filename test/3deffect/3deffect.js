import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VSHADER_SOURCE from 'glsl/v_image_shader.glsl'
import FSHADER_SOURCE from 'glsl/f_image_shader.glsl'
import { verticesTexCoords } from 'object/image'
import { GLObject } from 'object/object'
import { GLProgram } from 'shader/program'
import { GLScene } from 'scene/scene'
import { parsedData } from 'loader/objLoader'
import TextureSrc from './sample.jpg'
import DepthSrc from './depth_map.jpg'
import { InitEnv } from 'util/init'

let scene

InitEnv('webgl', [TextureSrc, DepthSrc], main)

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
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  let floor = new GLObject()
  floor.setAll(
    scene.gl,
    verticesTexCoords.positions,
    verticesTexCoords.normals,
    verticesTexCoords.textureCord,
    { posSize: 2, texSize: 2 },
    { u_texture: TextureSrc, u_depthTexture: DepthSrc }
  )

  scene.addObject('floor', floor)
  scene.addUniform1f('mouseX', 0.0001)

  scene.clear()

  scene.drawPlane()

  window.requestAnimationFrame(draw)
}

function draw(timestamp) {
  scene.clear()
  scene.drawPlane()
  window.requestAnimationFrame(draw)
}

document.addEventListener('mousedown', mousedown)
document.addEventListener('mouseup', mouseup)
document.addEventListener('mousemove', mousemove)
window.addEventListener('wheel', event => {
  let diff = event.deltaY
  rho += diff * 0.1
})

let mouseflag = false
let mousePos

function mousedown(mouse) {
  mouseflag = true
  mousePos = { x: mouse.clientX, y: mouse.clientY }
}

function mouseup() {
  mouseflag = false
}

function mousemove(evt) {
  if (mouseflag) {
    let width = window.innerWidth
    let mousex = evt.clientX
    let pos = (mousex - width / 2) * 2

    scene.addUniform1f('mouseX', pos * 0.00001)
  }
}
