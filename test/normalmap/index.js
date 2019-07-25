import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VSHADER_SOURCE from 'glsl/phong/v_phong_normal.glsl'
import FSHADER_SOURCE from 'glsl/phong/f_phong_normal.glsl'

import { verticesTexCoords } from 'object/image'
import { cubeData } from 'object/cube'
import { planeData, planeDataXZ } from 'object/plane'
import { GLObject } from 'object/object'
import { GLProgram } from 'shader/program'
import { GLScene } from 'scene/scene'
import { parsedData } from 'loader/objLoader'
import TextureSrc from 'loader/sample/texture/sample.png'
import NormalSrc from 'loader/sample/texture/sample_normal.png'
import { InitEnv } from 'util/init'
import { calcTangentData } from 'util/localcord'

let scene

InitEnv('webgl', [TextureSrc, NormalSrc], main)

function main(canvasId) {
  let canvas = document.getElementById(canvasId)
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element')
  }
  scene = new GLScene(canvas)
  var DepthEXT =
    scene.gl.getExtension('WEBKIT_WEBGL_depth_texture') ||
    scene.gl.getExtension('MOZ_WEBGL_depth_texture')

  start()
}

let theta = 1.4
let phi = 1.5
let rho = 5

function start() {
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  let lightPosition = {
    x: 0,
    y: 10,
    z: 0
  }

  let cameraPosition = {
    x: Math.sin(phi) * Math.cos(theta) * rho,
    y: rho * Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta) * rho
  }
  let targetPosition = {
    x: 0,
    y: 0,
    z: 0
  }

  let TB = calcTangentData(planeDataXZ)

  let attributeData = {
    Position: { data: planeDataXZ.positions, size: 3 },
    Normal: { data: planeDataXZ.normals, size: 3 },
    Texcoord: { data: planeDataXZ.textureCord, size: 2 },
    Tangent: { data: TB.T, size: 3 },
    Bitangent: { data: TB.B, size: 3 }
  }
  let floor = new GLObject()
  floor.setAttributeTexture(scene.gl, attributeData, {
    u_texture: TextureSrc,
    u_normal: NormalSrc
  })
  // floor.setModelPosition(-0.5, -2, -0.5)
  scene.addObject('floor', floor)

  scene.setLightPos(lightPosition.x, lightPosition.y, lightPosition.z)
  scene.setLightColor(1.0, 1.0, 1.0)

  let canvasWidth = scene.canvas.clientWidth
  let canvasHeight = scene.canvas.clientHeight

  let aspect = canvasWidth / canvasHeight
  scene.aspect = aspect
  scene.setPerspectiveCamera(lightPosition, targetPosition, aspect)
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

  let targetPosition = {
    x: 0,
    y: 0,
    z: 0
  }

  scene.setPerspectiveCamera(cameraPosition, targetPosition, scene.aspect)
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
