/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';
import { Shader } from './shaders/shader';
import { Sprite } from '../graghics/sprite';
import { Matrix4x4 } from '../math/matrix4x4';
import { MessageBus } from '../message/messageBus';
import { AssetManager } from '../assets/assetManager';
import { BasicShader } from './shaders/baseShader';
import { MaterialManager } from '../graghics/materialManager';
import { Material } from '../graghics/material';
import { Color } from '../graghics/color';

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
    const { gl } = this.glContext;
    AssetManager.initialize();
    gl.clearColor(0, 0, 0, 1);

    try {
      this.shader = await BasicShader.loadBasicShaderAsync(gl, 'resource/shader/vertex-source-1.glsl',
        'resource/shader/fragment-source-1.glsl');
      this.shader.use();

      MaterialManager.registerMaterial(new Material(gl, 'create', 'resource/assets/textures/tutorial.png', new Color(0, 128, 255, 255)));

      this.sprite = new Sprite(gl, 'test', 'create');
      this.sprite.load();
      this.sprite.position.x = 200;
      this.sprite.position.y = 100;
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
      

      const projectionPosition = this.shader.getUniformLocation('u_projection');
      gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.projection.data));

      this.sprite.draw(this.shader);
    }

    requestAnimationFrame(this.loop);
  }

  public resize() {
    const { gl, cavans } = this.glContext;

    cavans.width = window.innerWidth;
    cavans.height = window.innerHeight;

    gl.viewport(-1, -1, cavans.width, cavans.height);
    this.projection = Matrix4x4.orthographic(0, cavans.width, cavans.height, 0, -100.0, 100.0);
  }

}
