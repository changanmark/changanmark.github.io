import './style.css';
import {resizeCanvasToDisplaySize} from "./WebGLUtils";

function getCanvas(): HTMLCanvasElement {
  const element = document.querySelector<HTMLCanvasElement>('#app');
  if (!element) {
    throw new Error('Canvas element #app was not found.');
  }
  return element;
}

const canvas = getCanvas();
const gl = canvas.getContext("webgl2");
if (!gl) {
  throw new Error("浏览器不支持WebGL2");
}

const vertexShaderSource = `#version 300 es

in vec4 a_position;
out vec3 v_color;
void main() {
  gl_Position = a_position;
  v_color = a_position.xyz;
}
`

const fragmentShaderSource = `#version 300 es

precision highp float;
in vec3 v_color;
out vec4 outColor;

void main() {
  outColor = vec4(v_color, 1.0);
}
`

function createShader(gl: WebGL2RenderingContext, shaderType: GLenum, shaderSource: string): WebGLShader {
  const shader = gl.createShader(shaderType);
  if (!shader) {
    throw new Error("创建Shader失败")
  }

  gl.shaderSource(shader, shaderSource)
  gl.compileShader(shader)

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (!success) {
    console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
    gl.deleteShader(shader);
    throw new Error("创建Shader失败")
  }

  return shader;
}

function createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)

  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
    gl.deleteProgram(program);
    throw new Error("创建Program失败")
  }

  return program;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = createProgram(gl, vertexShader, fragmentShader)
gl.deleteShader(vertexShader)
gl.deleteShader(fragmentShader)

const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

const positions = [
  // 顶部
  0.0, 0.7,

  // 左下
  -0.7, -0.6,

  // 右下
  0.7, -0.6,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);
gl.enableVertexAttribArray(positionAttributeLocation);
const size = 2;          // 2 components per iteration
const type = gl.FLOAT;   // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0;        // start at the beginning of the buffer
gl.vertexAttribPointer(
  positionAttributeLocation, size, type, normalize, stride, offset);
gl.bindVertexArray(null)

function render(gl: WebGL2RenderingContext) {
  // 设置canvas大小为css大小
  resizeCanvasToDisplaySize(canvas)

  // 设置gl画的范围
  gl.viewport(0, 0, canvas.width, canvas.height)

  // 清屏
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  gl.useProgram(program)
  gl.bindVertexArray(vao)

  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

render(gl)
