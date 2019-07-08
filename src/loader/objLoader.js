import sampleCube from './sample/sampleTexturedCube2.obj'

let cubeDataArray = sampleCube.split('\n')

let positions = new Array()
let textureCord = new Array()
let normals = new Array()

let positions_f = new Array()
let textureCord_f = new Array()
let normals_f = new Array()

for (let i = 0; i < cubeDataArray.length; i++) {
  let data = cubeDataArray[i]
  let dataArray = data.split(' ')
  switch (dataArray[0]) {
    case '#':
      break
    case 'v':
      positions.push({
        x: Number(dataArray[1]),
        y: Number(dataArray[2]),
        z: Number(dataArray[3])
      })
      break
    case 'vt':
      textureCord.push({
        x: Number(dataArray[1]),
        y: Number(dataArray[2])
      })
      break
    case 'vn':
      normals.push({
        x: Number(dataArray[1]),
        y: Number(dataArray[2]),
        z: Number(dataArray[3])
      })
      break

    case 'f':
      for (let i = 1; i < 4; i++) {
        let firstVer = dataArray[i].split('/')
        positions_f.push(positions[firstVer[0] - 1].x)
        positions_f.push(positions[firstVer[0] - 1].y)
        positions_f.push(positions[firstVer[0] - 1].z)

        textureCord_f.push(textureCord[firstVer[1] - 1].x)
        textureCord_f.push(textureCord[firstVer[1] - 1].y)

        normals_f.push(normals[firstVer[2] - 1].x)
        normals_f.push(normals[firstVer[2] - 1].y)
        normals_f.push(normals[firstVer[2] - 1].z)
      }

      break
    default:
      break
  }
}

let positions_f32 = new Float32Array(positions_f.length)
let textureCord_f32 = new Float32Array(textureCord_f.length)
let normals_f32 = new Float32Array(normals_f.length)

for (let i = 0; i < positions_f.length; i++) {
  positions_f32[i] = positions_f[i]
}
for (let i = 0; i < textureCord_f.length; i++) {
  textureCord_f32[i] = textureCord_f[i]
}

for (let i = 0; i < normals_f.length; i++) {
  normals_f32[i] = normals_f[i]
}

let parsedData = {
  positions: positions_f32,
  normals: normals_f32,
  textureCord: textureCord_f32
}

export { parsedData }
