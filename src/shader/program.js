class GLProgram {
  constructor(program) {
    this.program = program
    this.DataByteSize = undefined
    this.objects = {}
  }

  drawElement(gl, DataLength) {
    gl.drawArrays(gl.TRIANGLES, 0, DataLength / 3)
  }

  setProgram(program) {
    this.program = program
  }

  setAttribute(gl, buffer, data_size, attribute_name) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    var attribute = gl.getAttribLocation(this.program, attribute_name)
    if (attribute < 0) {
      console.log('Failed to get the storage location of attribute')
      return -1
    }
    let FSIZE
    if (this.DataByteSize == undefined) {
      FSIZE = 4
    }

    gl.vertexAttribPointer(
      attribute,
      data_size,
      gl.FLOAT,
      false,
      FSIZE * data_size,
      0
    )
    gl.enableVertexAttribArray(attribute)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  setUniform1f(gl, u_name, val) {
    let u_val = gl.getUniformLocation(this.program, u_name)
    gl.uniform1f(u_val, val)
  }

  setUniform3fv(gl, u_name, val) {
    let u_val = gl.getUniformLocation(this.program, u_name)
    gl.uniform3fv(u_val, val)
  }

  setUniformMatrix4fv(gl, u_name, val) {
    let u_val = gl.getUniformLocation(this.program, u_name)
    gl.uniformMatrix4fv(u_val, false, val)
  }
}

export { GLProgram }
