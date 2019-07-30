/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';
import { Shader } from './shader';
import { HttpClient } from '../common/http/httpclient';

export class Engine {
  private glContext: GLContext;
  private shader: Shader | undefined;

  constructor() {
    this.glContext = WebGLUtils.initialize();
    this.loop = this.loop.bind(this);

    console.log('Engine is created.')
  }

  async start() {
    const { gl } = this.glContext;

    this.resize();
    gl.clearColor(0, 0, 0, 1);
    await this.loadShader();
    this.loop();
  }

  private loop() {
    const { gl } = this.glContext;
    gl.clear(gl.COLOR_BUFFER_BIT);

    requestAnimationFrame(this.loop);
  }

  public resize() {
    const { cavans } = this.glContext;

    cavans.width = window.innerWidth;
    cavans.height = window.innerHeight;
  }

  private async loadShader() {
    const vertexSource = await HttpClient.get('/examples/example-webgl/resource/shader/vertex-source-1.glsl');
    const fragmentSource = await HttpClient.get('/examples/example-webgl/resource/shader/fragment-source-1.glsl');

    this.shader = new Shader('base', this.glContext.gl, vertexSource.data, fragmentSource.data);
    this.shader.use();
  }
}
