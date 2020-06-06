import { mat4, ReadonlyVec3 } from 'gl-matrix'
import WebGLUtils from '../vendor/webgl-utils'
import { Camera, Sphere, Material, Shader, Scene } from '@packages/webgl'

const earthImage = new Image()
const vertexShaderSource = `
  attribute vec3 a_Position;
  attribute vec2 a_TexCoord;
  uniform mat4 u_ModelViewProjectionMatrix;
  varying vec2 v_TexCoord;
  void main() {
    // Output tex coord to frag shader.
    v_TexCoord = a_TexCoord;
    // Output the final position.
    gl_Position = u_ModelViewProjectionMatrix * vec4(a_Position, 1.0);
  }
`

const fragmentShaderSource = `
  #ifdef GL_ES
    precision mediump float;
  #endif
  uniform sampler2D u_Sampler;
  varying vec2 v_TexCoord;
  void main() {
    // Get texture color for tex coord.
    gl_FragColor = texture2D(u_Sampler, v_TexCoord);
  }
`

function setupScene() {
  let angle = 0
  // Setup camera.
  const eye: ReadonlyVec3 = [0.0, 0.0, 5.0]
  const center: ReadonlyVec3 = [0.0, 0.0, 0.0]
  const up: ReadonlyVec3 = [0.0, 1.0, 5.0]
  const fov = Math.PI / 3
  const aspect = 1.0
  const near = 0.1
  const far = 100.0
  const camera = new Camera(eye, center, up, fov, aspect, near, far)

  const canvas = document.getElementById('canvas')
  const gl = canvas && WebGLUtils.setupWebGL(canvas, null)
  if (gl) {
    const shader = new Shader(gl, vertexShaderSource, fragmentShaderSource)
    // Setup Earth.
    const earthMaterial = new Material(gl, null, null, null, null, earthImage)
    const earth = new Sphere(gl, earthMaterial, 2, 250, 250)

    // Setup scene.
    const scene = new Scene([earth], null)

    gl.clearColor(1, 1, 1, 1)
    gl.enable(gl.DEPTH_TEST)

    function update() {
      angle += (Math.PI / 4) * 0.01
    }

    function draw() {
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT)
      // why is this neccasry
      earth.modelToWorld = mat4.create()
      mat4.rotateY(earth.modelToWorld, earth.modelToWorld, -angle)

      shader.draw(scene, camera)
    }
    function animate() {
      requestAnimationFrame(animate)
      update()
      draw()
    }
    animate()
  }
  // Setup shader.
}

export function initEarth() {
  earthImage.src = '/images/uploads/logo.jpg'
  earthImage.onload = setupScene
}
