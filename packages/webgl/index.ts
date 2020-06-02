import { mat4, mat3, ReadonlyVec3 } from 'gl-matrix'

export class Scene {
  light: any
  meshes: Sphere[]
  constructor(meshes: Sphere[], light: any) {
    this.meshes = meshes
    this.light = light
  }
}

export class Camera {
  eye: ReadonlyVec3
  center: ReadonlyVec3
  up: ReadonlyVec3
  fov: number
  aspect: number
  near: number
  far: number
  worldToCamera: mat4
  cameraToWorld: mat4
  cameraToClip: mat4
  clipToCamera: mat4
  constructor(
    eye: ReadonlyVec3,
    center: ReadonlyVec3,
    up: ReadonlyVec3,
    fov: number,
    aspect: number,
    near: number,
    far: number
  ) {
    this.eye = eye
    this.center = center
    this.up = up
    this.fov = fov
    this.aspect = aspect
    this.near = near
    this.far = far

    this.worldToCamera = mat4.create()
    this.cameraToWorld = mat4.create()
    this.cameraToClip = mat4.create()
    this.clipToCamera = mat4.create()

    mat4.lookAt(this.worldToCamera, this.eye, this.center, this.up)
    mat4.invert(this.cameraToWorld, this.worldToCamera)

    mat4.perspective(
      this.cameraToClip,
      this.fov,
      this.aspect,
      this.near,
      this.far
    )
    mat4.invert(this.clipToCamera, this.cameraToClip)
  }
}

export class Material {
  ambient: Float32List | null
  diffuse: Float32List | null
  specular: Float32List | null
  shine: number | null
  texture!: ReturnType<WebGLRenderingContext['createTexture']>
  constructor(
    gl: WebGLRenderingContext,
    ambient: Float32List | null,
    diffuse: Float32List | null,
    specular: Float32List | null,
    shine: number | null,
    src: TexImageSource
  ) {
    this.ambient = ambient
    this.diffuse = diffuse
    this.specular = specular
    this.shine = shine

    this.buildTexture(gl, src)
  }
  buildTexture(gl: WebGLRenderingContext, src: TexImageSource) {
    this.texture = gl.createTexture()
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0),
      gl.bindTexture(gl.TEXTURE_2D, this.texture),
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src),
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR),
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_NEAREST
      ),
      gl.generateMipmap(gl.TEXTURE_2D),
      gl.bindTexture(gl.TEXTURE_2D, null)
  }
}

export class Mesh {
  material: Material
  constructor(material: Material) {
    this.material = material
  }
}

export class Sphere extends Mesh {
  radius: any
  latitudeBands: any
  longitudeBands: any
  positionsBuffer!: ReturnType<WebGLRenderingContext['createBuffer']>
  normalsBuffer!: ReturnType<WebGLRenderingContext['createBuffer']>
  textureCoordsBuffer!: ReturnType<WebGLRenderingContext['createBuffer']>
  indicesBuffer!: ReturnType<WebGLRenderingContext['createBuffer']>
  positions!: Float32Array
  normals!: Float32Array
  textureCoords!: Float32Array
  indices!: Uint16Array
  indicesCount!: number

  modelToWorld!: mat4
  worldToModel!: mat4

  constructor(
    gl: WebGLRenderingContext,
    material: any,
    radius: any,
    latitude: any,
    longitude: any
  ) {
    super(material)

    this.radius = radius
    this.latitudeBands = latitude
    this.longitudeBands = longitude

    this.buildArrays()
    this.buildBuffers(gl)
    this.buildTransforms()
  }
  buildArrays() {
    const positionArr = []
    const normalsArr = []
    const textureCoordsArr = []
    const indicesArr = []
    for (var o = 0; o <= this.latitudeBands; ++o) {
      const e = (o * Math.PI) / this.latitudeBands
      const i = Math.sin(e)
      const l = Math.cos(e)
      for (let u = 0; u <= this.longitudeBands; ++u) {
        const s = (2 * u * Math.PI) / this.longitudeBands
        const M = Math.sin(s)
        const h = Math.cos(s)
        const c = h * i
        const f = l
        const m = M * i
        const S = 1 - u / this.longitudeBands
        const x = 1 - o / this.latitudeBands

        positionArr.push(this.radius * c)
        positionArr.push(this.radius * f)
        positionArr.push(this.radius * m)
        normalsArr.push(c)
        normalsArr.push(f)
        normalsArr.push(m)
        textureCoordsArr.push(S)
        textureCoordsArr.push(x)
      }
    }
    for (let o = 0; o < this.latitudeBands; ++o) {
      for (let u = 0; u < this.longitudeBands; ++u) {
        const d = o * (this.longitudeBands + 1) + u
        const I = d + this.longitudeBands + 1
        indicesArr.push(d)
        indicesArr.push(I)
        indicesArr.push(d + 1)
        indicesArr.push(I)
        indicesArr.push(I + 1)
        indicesArr.push(d + 1)
      }
    }

    this.indicesCount = indicesArr.length
    this.positions = new Float32Array(positionArr)
    this.normals = new Float32Array(normalsArr)
    this.textureCoords = new Float32Array(textureCoordsArr)
    this.indices = new Uint16Array(indicesArr)
  }
  buildTransforms() {
    this.modelToWorld = mat4.create()
    this.worldToModel = mat4.create()
    mat4.invert(this.worldToModel, this.modelToWorld)
  }
  buildBuffers(gl: WebGLRenderingContext) {
    this.positionsBuffer = gl.createBuffer()
    this.normalsBuffer = gl.createBuffer()
    this.textureCoordsBuffer = gl.createBuffer()
    this.indicesBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.textureCoords, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW)
  }
}

export class Shader {
  gl: WebGLRenderingContext
  program: ReturnType<WebGLRenderingContext['createProgram']>
  constructor(gl: WebGLRenderingContext, vertex: any, fragment: any) {
    this.gl = gl
    this.program = this.createProgram(gl, vertex, fragment)
    if (this.program) {
      gl.useProgram(this.program)
    }
  }
  loadShader(gl: WebGLRenderingContext, vertex: number, source: string) {
    const vertexShader = gl.createShader(vertex)
    if (vertexShader === null) {
      console.log('Shader.ts: loadShader: shader === null.')
      return null
    }
    gl.shaderSource(vertexShader, source)
    gl.compileShader(vertexShader)
    const shaderParameter = gl.getShaderParameter(
      vertexShader,
      gl.COMPILE_STATUS
    )
    if (!shaderParameter) {
      var e = gl.getShaderInfoLog(vertexShader)
      return (
        console.log('Shader.ts: loadShader: Failed to compile shader: ' + e),
        gl.deleteShader(vertexShader),
        null
      )
    }
    return vertexShader
  }
  createProgram(gl: WebGLRenderingContext, vertex: string, fragment: any) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vertex)
    const fragementShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fragment)
    if (!vertexShader || !fragementShader) {
      console.log(
        `Shader.ts: createProgram: No vertex shader or fragment shader: ${vertexShader}, ${fragementShader}`
      )
      return null
    }
    const program = gl.createProgram()
    if (!program) {
      console.log('Shader.ts: createProgram: No program: ', program)
      return null
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragementShader)
    gl.linkProgram(program)
    const programParam = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!programParam) {
      console.log(
        `Shader.ts: createProgram: Failed to link program: ${gl.getProgramInfoLog(
          program
        )}`
      )
      gl.deleteProgram(program)
      gl.deleteShader(fragementShader)
      gl.deleteShader(vertexShader)
      return null
    }
    return program
  }
  setPosition(mesh: Sphere) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.positionsBuffer)
    if (!this.program) return
    const attribLocation = this.gl.getAttribLocation(this.program, 'a_Position')
    if (attribLocation > -1) {
      this.gl.vertexAttribPointer(attribLocation, 3, this.gl.FLOAT, !1, 0, 0)
      this.gl.enableVertexAttribArray(attribLocation)
    }
  }
  setNormal(sphere: Sphere) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sphere.normalsBuffer)
    if (!this.program) return
    const attribLocation = this.gl.getAttribLocation(this.program, 'a_Normal')
    if (attribLocation > -1) {
      this.gl.vertexAttribPointer(attribLocation, 3, this.gl.FLOAT, false, 0, 0)
      this.gl.enableVertexAttribArray(attribLocation)
    }
  }
  setTextureCoords(sphere: Sphere) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, sphere.textureCoordsBuffer)
    if (!this.program) return
    const attribLocation = this.gl.getAttribLocation(this.program, 'a_TexCoord')
    if (attribLocation > -1) {
      this.gl.vertexAttribPointer(
        attribLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      ),
        this.gl.enableVertexAttribArray(attribLocation)
    }
  }
  activateTexture(material: Sphere['material']) {
    this.gl.activeTexture(this.gl.TEXTURE0)
    this.gl.bindTexture(this.gl.TEXTURE_2D, material.texture)
  }
  setUniformsSampler() {
    if (!this.program) return
    const uniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_Sampler'
    )
    if (uniformLocation && uniformLocation > -1) {
      this.gl.uniform1i(uniformLocation, 0)
    }
  }
  setUniformsModelViewMatrix(sphere: Sphere, camera: Camera) {
    if (!this.program) return

    const identity = mat4.create()
    mat4.multiply(identity, camera.worldToCamera, sphere.modelToWorld)
    const uniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_ModelViewMatrix'
    )
    this.gl.uniformMatrix4fv(uniformLocation, false, identity)
    const inversedIdentity = mat4.create()
    mat4.invert(inversedIdentity, identity)
    const inversedUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_ModelViewMatrixInverse'
    )
    this.gl.uniformMatrix4fv(inversedUniformLocation, false, inversedIdentity)
  }
  setUniformsNormalMatrix(sphere: Sphere, camera: Camera) {
    if (!this.program) return

    const identity = mat4.create()
    mat4.multiply(identity, camera.worldToCamera, sphere.modelToWorld)
    var mat3Identity = mat3.create()
    mat3.fromMat4(mat3Identity, identity)
    const uniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_NormalMatrix'
    )
    this.gl.uniformMatrix3fv(uniformLocation, false, mat3Identity)
  }
  setUniformsProjectionMatrix(camera: Camera) {
    if (!this.program) return

    const uniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_ProjectionMatrix'
    )
    this.gl.uniformMatrix4fv(uniformLocation, false, camera.cameraToClip)
    const inversedUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_ProjectionMatrixInverse'
    )
    this.gl.uniformMatrix4fv(
      inversedUniformLocation,
      false,
      camera.clipToCamera
    )
  }
  setUniformsModelViewProjectionMatrix(sphere: Sphere, camera: Camera) {
    if (!this.program) return

    const identity = mat4.create()
    mat4.multiply(identity, camera.worldToCamera, sphere.modelToWorld)

    const outIdentity = mat4.create()
    mat4.multiply(outIdentity, camera.cameraToClip, identity)

    const uniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_ModelViewProjectionMatrix'
    )
    this.gl.uniformMatrix4fv(uniformLocation, false, outIdentity)
    const inversedIdentity = mat4.create()
    mat4.invert(inversedIdentity, outIdentity)
    const inversedUniformLocation = this.gl.getUniformLocation(
      this.program,
      'u_ModelViewProjectionMatrixInverse'
    )
    this.gl.uniformMatrix4fv(inversedUniformLocation, false, inversedIdentity)
  }
  setUniformsLights(sphere: Sphere) {}
  setUniformsMaterials(sphere: Sphere) {
    if (sphere.material && this.program) {
      if (sphere.material.ambient) {
        var a = this.gl.getUniformLocation(this.program, 'u_Material.ambient')
        this.gl.uniform3fv(a, sphere.material.ambient)
      }
      if (sphere.material.diffuse) {
        var r = this.gl.getUniformLocation(this.program, 'u_Material.diffuse')
        this.gl.uniform3fv(r, sphere.material.diffuse)
      }
      if (sphere.material.specular) {
        var n = this.gl.getUniformLocation(this.program, 'u_Material.specular')
        this.gl.uniform3fv(n, sphere.material.specular)
      }
      if (sphere.material.shine) {
        var o = this.gl.getUniformLocation(this.program, 'u_Material.shine')
        this.gl.uniform1f(o, sphere.material.shine)
      }
    }
  }
  public draw(scene: Scene, camera: Camera) {
    scene.meshes.forEach((mesh) => {
      this.setPosition(mesh)
      this.setNormal(mesh)
      this.setTextureCoords(mesh)
      this.activateTexture(mesh.material)
      this.setUniformsSampler()
      this.setUniformsModelViewMatrix(mesh, camera)
      this.setUniformsNormalMatrix(mesh, camera)
      this.setUniformsProjectionMatrix(camera)
      this.setUniformsModelViewProjectionMatrix(mesh, camera)
      // this.setUniformsLights(mesh.light)
      this.setUniformsMaterials(mesh)
      this.gl.drawElements(
        this.gl.TRIANGLES,
        mesh.indicesCount,
        this.gl.UNSIGNED_SHORT,
        0
      )
    })
  }
}
