let planeData = {
  positions: new Float32Array([
    -0.5,
    0.5,
    0.0,

    -0.5,
    -0.5,
    0.0,

    0.5,
    0.5,
    0.0,

    -0.5,
    -0.5,
    0.0,

    0.5,
    0.5,
    0.0,

    0.5,
    -0.5,
    0.0
  ]),
  normals: new Float32Array([
    0.0,
    0.0,
    1.0,

    0.0,
    0.0,
    1.0,

    0.0,
    0.0,
    1.0,

    0.0,
    0.0,
    1.0,

    0.0,
    0.0,
    1.0,

    0.0,
    0.0,
    1.0
  ]),

  textureCord: new Float32Array([
    0.0,
    1.0,

    0.0,
    0.0,

    1.0,
    1.0,

    0.0,
    0.0,

    1.0,
    1.0,

    1.0,
    0.0
  ])
}

let planeDataXZ = {
  positions: new Float32Array([
    -0.5,
    0.0,
    0.5,

    -0.5,
    0.0,
    -0.5,

    0.5,
    0.0,
    0.5,

    -0.5,
    0.0,
    -0.5,

    0.5,
    0.0,
    0.5,

    0.5,
    0.0,
    -0.5
  ]),
  normals: new Float32Array([
    0.0,
    1.0,
    0.0,

    0.0,
    1.0,
    0.0,

    0.0,
    1.0,
    0.0,

    0.0,
    1.0,
    0.0,

    0.0,
    1.0,
    0.0,

    0.0,
    1.0,
    0.0
  ]),

  textureCord: new Float32Array([
    0.0,
    1.0,

    0.0,
    0.0,

    1.0,
    1.0,

    0.0,
    0.0,

    1.0,
    1.0,

    1.0,
    0.0
  ])
}

export { planeData, planeDataXZ }
