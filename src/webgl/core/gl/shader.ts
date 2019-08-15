/**
 * 着色器类
 */
const GL = WebGLRenderingContext;
export class Shader {
  private _name: string;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private attributes: { [name: string]: number } = {};
  private uniforms: { [name: string]: WebGLUniformLocation | null } = {};

  constructor(name: string, gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
    this._name = name;
    this.gl = gl;

    const vertexShader = this.loadShader(vertexSource, this.gl.VERTEX_SHADER);
    const fragmentShader = this.loadShader(fragmentSource, this.gl.FRAGMENT_SHADER);

    this.program = this.createProgram(vertexShader, fragmentShader);

    this.detectAttributes();
    this.detectUniforms();
  }

  public get name(): string {
    return this._name;
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
      throw new Error(`some error ocurred when create program, shader name: ${this._name}`);
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    const log = this.gl.getProgramInfoLog(program);
    if (log !== null && log.trim().length > 0) {
      throw new Error(`some error ocurred when link program, error: ${log}, shader name: ${this._name}`);
    }

    return program;
  }

  public getAttributeLoaction(name: string): number {
    const location = this.attributes[name];
    if (location === undefined) {
      throw new Error(`can not find attribute named '${name}' in shader named '${this._name}.'`);
    }

    return location;
  }

  public getUniformLocation(name: string): WebGLUniformLocation | null {
    const uniform = this.uniforms[name];
    if (uniform === undefined) {
      throw new Error(`can not find uniform named '${name}' in shader named '${this._name}.'`);
    }

    return uniform;
  }

  private detectAttributes(): void {
    const attributeCount = this.gl.getProgramParameter(this.program, GL.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < attributeCount; i++) {
      const info = this.gl.getActiveAttrib(this.program, i);
      if (!info) {
        break;
      }

      this.attributes[info.name] = this.gl.getAttribLocation(this.program, info.name);
    }
  }

  private detectUniforms(): void {
    const uniformCount = this.gl.getProgramParameter(this.program, GL.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const info = this.gl.getActiveUniform(this.program, i);
      if (!info) {
        break;
      }

      this.uniforms[info.name] = this.gl.getUniformLocation(this.program, info.name);
    }
  }
}
