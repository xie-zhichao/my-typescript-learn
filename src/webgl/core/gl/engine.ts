/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';
import { Shader } from './shader';
import { HttpClient } from '../../common/http/httpclient';
import { Sprite } from '../graghics/sprite';
import { Matrix4x4 } from '../math/matrix4x4';
import { MessageBus } from '../message/messageBus';
import { AssetManager } from '../assets/assetManager';

export class Engine {
  private glContext: GLContext;
  private shader: Shader | undefined;
  private sprite: Sprite | undefined;
  private projection: Matrix4x4 | undefined;

  constructor() {
    this.glContext = WebGLUtils.initialize();
    this.loop = this.loop.bind(this);

    console.log('Engine is created.')
  }

  async start() {
    const { gl, cavans } = this.glContext;
    AssetManager.initialize();
    gl.clearColor(0, 0, 0, 1);

    try {
      this.shader = await this.loadShader();
      this.shader.use();
      this.projection = Matrix4x4.orthographic(0, cavans.width, 0, cavans.height, -1.0, 100.0);
      this.sprite = new Sprite(gl, 'test', 'resource/assets/textures/tutorial.png');
      this.sprite.load();
      this.sprite.position.x = 200;
    } catch (error) {
      throw new Error(`draw sprite error: ${error}`);
    }

    this.resize();
    this.loop();
  }

  private loop() {
    MessageBus.update(0);

    const { gl } = this.glContext;
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.shader !== undefined && this.projection !== undefined && this.sprite !== undefined) {
      const colorPosition = this.shader.getUniformLocation('u_tint');
      gl.uniform4f(colorPosition, 1, 0.5, 1, 1);

      const projectionPosition = this.shader.getUniformLocation('u_projection');
      gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.projection.data));

      const modelPosition = this.shader.getUniformLocation('u_model');
      gl.uniformMatrix4fv(modelPosition, false, new Float32Array(Matrix4x4.translation(this.sprite.position).data));

      this.sprite.draw(this.shader);
    }

    requestAnimationFrame(this.loop);
  }

  public resize() {
    const { gl, cavans } = this.glContext;

    cavans.width = window.innerWidth;
    cavans.height = window.innerHeight;

    gl.viewport(-1, -1, cavans.width, cavans.height);
  }

  private async loadShader(): Promise<Shader> {
    const { response: vertexSource } = await HttpClient.get('resource/shader/vertex-source-1.glsl');
    const { response: fragmentSource } = await HttpClient.get('resource/shader/fragment-source-1.glsl');
    const { gl } = this.glContext;
    const shader = new Shader('base', gl, vertexSource, fragmentSource);

    return shader;
  }

}
