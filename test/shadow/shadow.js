import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from 'lib/cuon-utils'
import { Matrix4 } from 'lib/cuon-matrix'
import { RenderObject } from 'util'
import VSHADER_SOURCE from 'glsl/phong/v_phong_shader.glsl'
import FSHADER_SOURCE from 'glsl/phong/f_phong_shader.glsl'

import VSSHADER_SOURCE from 'glsl/phong_shadow/v_shader.glsl'
import FSSHADER_SOURCE from 'glsl/phong_shadow/f_shader.glsl'

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
  var DepthEXT =
    scene.gl.getExtension('WEBKIT_WEBGL_depth_texture') ||
    scene.gl.getExtension('MOZ_WEBGL_depth_texture')

  start()
}

let theta = 6.4
let phi = 0.5
let rho = 14

function start() {
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  let lightPosition = {
    x: -10,
    y: 11,
    z: -10
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

  scene.setLightPos(lightPosition.x, lightPosition.y, lightPosition.z)
  scene.setLightColor(1.0, 1.0, 1.0)

  let canvasWidth = scene.canvas.clientWidth
  let canvasHeight = scene.canvas.clientHeight

  scene.createTargetTexture('targetTex', canvasWidth, canvasHeight, 'depth')

  scene.bindFrambufferAndSetViewport(canvasWidth, canvasHeight)
  scene.attachTargetTextureToFrameBuffer('targetTex', 'depth')

  let aspect = canvasWidth / canvasHeight
  scene.setPerspectiveCamera(lightPosition, targetPosition, aspect)
  scene.clear()
  scene.draw()

  scene.unbindFrambufferAndSetViewport(canvasWidth, canvasHeight)
  let fromlightVPMatrix = scene.vpMatrix

  let program2 = createProgram(scene.gl, VSSHADER_SOURCE, FSSHADER_SOURCE)
  let glprogram2 = new GLProgram(program2)

  scene.setProgram('shadow', glprogram2)
  scene.useProgram('shadow')
  scene.defaultSetting()
  scene.setLightPos(lightPosition.x, lightPosition.y, lightPosition.z)
  scene.setLightColor(1.0, 1.0, 1.0)
  floor.setTextureObject('u_depthTexture', scene.targetTexture['targetTex'])

  scene.addObject('floor', floor)
  scene.activeProgram.setUniformMatrix4fv(
    scene.gl,
    'lightVPMatrix',
    fromlightVPMatrix.elements
  )

  scene.setPerspectiveCamera(cameraPosition, targetPosition, aspect)

  scene.clear()
  scene.draw()

  // window.requestAnimationFrame(draw)
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

  scene.useProgram('simple')
  let canvasWidth = scene.canvas.clientWidth
  let canvasHeight = scene.canvas.clientHeight
  scene.bindFrambufferAndSetViewport(canvasWidth, canvasHeight)
  scene.attachTargetTextureToFrameBuffer('targetTex', 'depth')
  scene.addDepthRenderBuffer(canvasWidth, canvasHeight)
  let aspect = canvasWidth / canvasHeight
  scene.setPerspectiveCamera(cameraPosition, targetPosition, aspect)
  scene.clear()
  scene.draw()
  scene.unbindFrambufferAndSetViewport(canvasWidth, canvasHeight)

  scene.useProgram('image')
  scene.activeProgram.objects['image'].setTextureObject(
    'u_texture',
    scene.targetTexture['targetTex']
  )

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
