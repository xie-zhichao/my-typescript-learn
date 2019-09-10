/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';
import { Shader } from './shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { MessageBus } from '../message/messageBus';
import { AssetManager } from '../assets/assetManager';
import { BasicShader } from './shaders/baseShader';
import { MaterialManager } from '../graghics/materialManager';
import { Material } from '../graghics/material';
import { Color } from '../graghics/color';
import { ZoneManager } from '../world/ZoneManager';

export class Engine {
  private glContext: GLContext;
  private basicShader: Shader | undefined;
  private projection: Matrix4x4 | undefined;

  constructor() {
    this.glContext = WebGLUtils.initialize();
    this.loop = this.loop.bind(this);

    console.log('Engine is created.')
  }

  async start() {
    const { gl } = this.glContext;
    AssetManager.initialize();
    ZoneManager.initialize(gl);

    gl.clearColor(0, 0, 0, 1);

    try {
      this.basicShader = await BasicShader.loadBasicShaderAsync(gl, 'resource/shader/vertex-source-1.glsl',
        'resource/shader/fragment-source-1.glsl');
      this.basicShader.use();

      MaterialManager.registerMaterial(new Material(gl, 'create', 'resource/assets/textures/tutorial.png', new Color(0, 128, 255, 255)));

      ZoneManager.changeZone(gl, 0);
    } catch (error) {
      throw new Error(`draw sprite error: ${error}`);
    }

    this.resize();
    this.loop();
  }

  private loop() {
    MessageBus.update(0);
    ZoneManager.update(0);

    const { gl } = this.glContext;
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.basicShader !== undefined && this.projection !== undefined) {
      ZoneManager.render(this.basicShader);

      const projectionPosition = this.basicShader.getUniformLocation('u_projection');
      gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.projection.data));
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
