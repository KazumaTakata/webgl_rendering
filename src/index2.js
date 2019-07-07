import {
  getWebGLContext,
  initShaders,
  createProgram,
  useProgram
} from './lib/cuon-utils'
import { Matrix4 } from './lib/cuon-matrix'
import { RenderObject } from './util'
import { VSHADER_SOURCE, FSHADER_SOURCE } from './shader/simpleShader'
import { cubeData } from './object/cube'
import { GLObject } from './object/object'
import { GLProgram } from './shader/program'
import { GLScene } from './scene/scene'

let scene

function main() {
  let canvas = document.getElementById('webgl')
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element')
  }
  scene = new GLScene(canvas)
  start()

  document.addEventListener('keydown', keyPress)
}

main()

function start() {
  let program = createProgram(scene.gl, VSHADER_SOURCE, FSHADER_SOURCE)
  let glprogram = new GLProgram(program)
  scene.setProgram('simple', glprogram)
  scene.useProgram('simple')
  scene.defaultSetting()

  let floor = new GLObject()
  floor.setAll(scene.gl, cubeData.positions, cubeData.normals, cubeData.colors)
  floor.setModelPosition(-0.5, 0, -0.5)
  scene.addObject('floor', floor)

  let floor2 = new GLObject()
  floor2.setAll(scene.gl, cubeData.positions, cubeData.normals, cubeData.colors)
  floor2.setModelPosition(0.5, 0, 0.5)
  scene.addObject('floor2', floor2)

  let floor3 = new GLObject()
  floor3.setAll(scene.gl, cubeData.positions, cubeData.normals, cubeData.colors)
  floor3.setModelPosition(1.5, 0, 1.5)
  scene.addObject('floor3', floor3)

  let theta = 2
  //   scene.setDirectionalLight(2.5, 1.5, 0.5)
  scene.setLightPos(-4.5, 6.5, -4)
  scene.setLightColor(0.4, 1, 0)
  let cameraPosition = {
    x: 10,
    y: 11,
    z: 10
  }
  let targetPosition = {
    x: 0,
    y: 0,
    z: 0
  }

  scene.setPerspectiveCamera(cameraPosition, targetPosition)
  scene.setViewPos()

  scene.clear()
  scene.draw()
}

function keyPress(key) {
  console.log(key)

  switch (event.key) {
    case 'ArrowLeft':
      // Left pressed
      theta -= 0.1
      break
    case 'ArrowRight':
      // Right pressed
      theta += 0.1
      break
    case 'ArrowUp':
      // Up pressed
      break
    case 'ArrowDown':
      // Down pressed
      break
  }

  drawElement()
}
