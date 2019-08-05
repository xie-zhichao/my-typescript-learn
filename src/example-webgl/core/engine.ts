/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';
import { Shader } from './shader';
import { HttpClient } from '../common/http/httpclient';

export class Engine {
  private glContext: GLContext;
  private shader: Shader | undefined;
  private buffer: WebGLBuffer | undefined;

  constructor() {
    this.glContext = WebGLUtils.initialize();
    this.loop = this.loop.bind(this);

    console.log('Engine is created.')
  }

  async start() {
    const { gl } = this.glContext;

    gl.clearColor(0, 0, 0, 1);

    try {
      this.shader = await this.loadShader();
      this.shader.use();
      this.buffer = this.createBuffer();
    } catch (error) {
      console.log(`setup shader error: ${error}`);
    }
    
    this.resize();
    this.loop();
  }

  private loop() {
    const { gl } = this.glContext;
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer || null);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(this.loop);
  }

  public resize() {
    const { cavans } = this.glContext;

    cavans.width = window.innerWidth;
    cavans.height = window.innerHeight;
  }

  private async loadShader(): Promise<Shader> {
    const vertexSource = await HttpClient.get('/examples/example-webgl/resource/shader/vertex-source-1.glsl');
    const fragmentSource = await HttpClient.get('/examples/example-webgl/resource/shader/fragment-source-1.glsl');
    const { gl } = this.glContext;
    const shader = new Shader('base', gl, vertexSource.data, fragmentSource.data);
    
    return shader;
  }

  private createBuffer(): WebGLBuffer {
    const { gl } = this.glContext;
    const buffer = gl.createBuffer();

    if (buffer === null) {
      throw new Error('create buffer error');
    }

    const vertices = [
      // x,y,z
      0, 0, 0,
      0, 0.5, 0,
      0.5, 0.5, 0
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.disableVertexAttribArray(0);

    return buffer;
  }
}
