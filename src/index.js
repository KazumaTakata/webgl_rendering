import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from './lib/cuon-utils'
import { Matrix4 } from './lib/cuon-matrix'
import { RenderObject } from './util'
import VSHADER_SOURCE from './glsl/v_phong_shader.glsl'
import FSHADER_SOURCE from './glsl/f_phong_shader.glsl'
import { cubeData } from './object/cube'
import { GLObject } from './object/object'
import { GLProgram } from './shader/program'
import { GLScene } from './scene/scene'
import { parsedData } from './loader/objLoader'
import TextureSrc from './loader/sample/texture/sample.png'
import { InitEnv } from './util/init'

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
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  let floor = new GLObject()
  floor.setAll(
    scene.gl,
    parsedData.positions,
    parsedData.normals,
    parsedData.textureCord,
    { posSize: 3, norSize: 3, texSize: 2 },
    { u_texture: TextureSrc }
  )
  // floor.setModelPosition(-0.5, -2, -0.5)
  scene.addObject('floor', floor)

  scene.setLightPos(-10, 11, -10)
  scene.setLightColor(1.0, 1.0, 1.0)
  let cameraPosition = {
    x: Math.sin(theta) * 20,
    y: 20,
    z: Math.cos(theta) * 20
  }
  let targetPosition = {
    x: 0,
    y: 0,
    z: 0
  }

  let aspect = scene.canvas.clientWidth / scene.canvas.clientHeight

  scene.setPerspectiveCamera(cameraPosition, targetPosition, aspect)
  // scene.setViewPos()

  scene.clear()
  scene.draw()

  window.requestAnimationFrame(draw)
}

function draw(timestamp) {
  let cameraPosition = {
    x: Math.sin(phi) * Math.cos(theta) * rho,
    y: rho * Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta) * rho
  }
  scene.setPerspectiveCamera(cameraPosition, scene.targetPosition, 1)

  scene.clear()
  scene.draw()
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

function mousemove(mouse) {
  if (mouseflag) {
    let curPos = { x: mouse.clientX, y: mouse.clientY }
    let diffX = curPos.x - mousePos.x
    let diffY = curPos.y - mousePos.y
    theta += diffX * 0.01

    phi += diffY * 0.01

    if (phi < 0.1) {
      phi = 0.1
    }

    if (phi > Math.PI / 2) {
      phi = Math.PI / 2
    }

    mousePos = curPos
  }
}
