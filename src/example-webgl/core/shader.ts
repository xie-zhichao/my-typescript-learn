/**
 * 着色器类
 */
export class Shader {
  name: string;
  gl: WebGLRenderingContext;
  program: WebGLProgram;

  constructor(name: string, gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this.name = name;
    this.gl = gl;

    const vertexShader = this.loadShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.loadShader(fragmentSource, this.gl.FRAGMENT_SHADER);

    this.program = this.createProgram(vertexShader, fragmentShader);
  }

  public getName(): string {
    return this.name;
  }

  public use(): void {
    this.gl.useProgram(this.program);
  }

  private loadShader(shaderSource: string, shaderType: number): WebGLShader {
    const shader = this.gl.createShader(shaderType);
    if (shader === null) {
      throw new Error(`some error ocurred when create shader, type: ${shaderType}, source: ${shaderSource}`);
    }

    this.gl.shaderSource(shader, shaderSource);
    this.gl.compileShader(shader);
    const log = this.gl.getShaderInfoLog(shader);
    if (log !== null && log.trim().length > 0) {
      throw new Error(`some error ocurred when compile shader, error: ${log}, type: ${shaderType}, source: ${shaderSource}`);
    }

    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = this.gl.createProgram();
    if (program === null) {
      throw new Error(`some error ocurred when create program, shader name: ${this.name}`);
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    const log = this.gl.getProgramInfoLog(program);
    if (log !== null && log.trim().length > 0) {
      throw new Error(`some error ocurred when link program, error: ${log}, shader name: ${this.name}`);
    }

    return program;
  }
}