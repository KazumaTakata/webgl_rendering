import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VSHADER_SOURCE from 'glsl/phong/v_phong_shader.glsl'
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

function calculateTangent(positions, textureCord) {
  let e1 = {
    x: positions[0].x - positions[1].x,
    y: positions[0].y - positions[1].y,
    z: positions[0].z - positions[1].z
  }

  let e2 = {
    x: positions[2].x - positions[1].x,
    y: positions[2].y - positions[1].y,
    z: positions[2].z - positions[1].z
  }
  let deltaU1 = textureCord[0].x - textureCord[1].x
  let deltaV1 = textureCord[0].y - textureCord[1].y

  let deltaU2 = textureCord[2].x - textureCord[1].x
  let deltaV2 = textureCord[2].y - textureCord[1].y

  let deno = deltaU1 * deltaV2 - deltaU2 * deltaV1
  let tx = (1 / deno) * (deltaV2 * e1.x - deltaV1 * e2.x)
  let ty = (1 / deno) * (deltaV2 * e1.y - deltaV1 * e2.y)
  let tz = (1 / deno) * (deltaV2 * e1.z - deltaV1 * e2.z)

  let bx = (1 / deno) * (-deltaU2 * e1.x - deltaU1 * e2.x)
  let by = (1 / deno) * (-deltaU2 * e1.y - deltaU1 * e2.y)
  let bz = (1 / deno) * (-deltaU2 * e1.z - deltaU1 * e2.z)

  let tlength = Math.sqrt(tx * tx + ty * ty + tz * tz)
  let T = { x: tx / tlength, y: ty / tlength, z: tz / tlength }
  let blength = Math.sqrt(bx * bx + by * by + bz * bz)
  let B = { x: bx / blength, y: by / blength, z: bz / blength }
  return { T: T, B: B }
}

function start() {
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  let lightPosition = {
    x: 0,
    y: 0,
    z: 10
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

  let positionData = []
  let textureCordData = []
  for (let i = 0; i < 3; i++) {
    positionData.push({
      x: planeDataXZ.positions[i * 3],
      y: planeDataXZ.positions[i * 3 + 1],
      z: planeDataXZ.positions[i * 3 + 2]
    })
  }

  for (let i = 0; i < 3; i++) {
    textureCordData.push({
      x: planeDataXZ.textureCord[i * 2],
      y: planeDataXZ.textureCord[i * 2 + 1]
    })
  }

  let Tangent = calculateTangent(positionData, textureCordData)

  let floor = new GLObject()
  floor.setAll(
    scene.gl,
    planeDataXZ.positions,
    planeDataXZ.normals,
    planeDataXZ.textureCord,
    { posSize: 3, norSize: 3, texSize: 2 },
    { u_texture: TextureSrc, u_normal: NormalSrc }
  )
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
