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

function calcTangentData(Data) {
  let T = new Float32Array(Data.positions.length)
  let B = new Float32Array(Data.positions.length)
  let length = Data.positions.length / 9
  for (let j = 0; j < length; j++) {
    let positionData = []
    let textureCordData = []

    for (let i = 0; i < 3; i++) {
      positionData.push({
        x: Data.positions[9 * j + i * 3],
        y: Data.positions[9 * j + i * 3 + 1],
        z: Data.positions[9 * j + i * 3 + 2]
      })
    }

    for (let i = 0; i < 3; i++) {
      textureCordData.push({
        x: Data.textureCord[6 * j + i * 2],
        y: Data.textureCord[6 * j + i * 2 + 1]
      })
    }

    let Tangent = calculateTangent(positionData, textureCordData)

    for (let i = 0; i < 3; i++) {
      T[0 + i * 3 + j * 9] = Tangent.T.x
      T[1 + i * 3 + j * 9] = Tangent.T.y
      T[2 + i * 3 + j * 9] = Tangent.T.z
    }

    for (let i = 0; i < 3; i++) {
      B[0 + i * 3 + j * 9] = Tangent.B.x
      B[1 + i * 3 + j * 9] = Tangent.B.y
      B[2 + i * 3 + j * 9] = Tangent.B.z
    }
  }

  return { T: T, B: B }
}

export { calcTangentData }
