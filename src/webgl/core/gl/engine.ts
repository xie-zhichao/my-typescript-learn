/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';
import { Shader } from './shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { MessageBus } from '../message/messageBus';
import { AssetManager } from '../assets/assetManager';
import { AsyncShaderLoader } from './shaders/AsyncShaderLoader';
import { MaterialManager } from '../graghics/materialManager';
import { Material } from '../graghics/material';
import { Color } from '../graghics/color';
import { ZoneManager } from '../world/ZoneManager';
import { ComponentManager } from '../components/ComponentManager';
import { SpriteComponentBuilder } from '../components/SpriteComponent';
import { BehaviorManager } from '../behaviors/BehaviorManager';
import { KeyboardMovementBehaviorBuilder } from '../behaviors/KeyboardMovementBehaviorData';
import { RotationBehaviorBuilder } from '../behaviors/RotationBehavior';
import { Message } from '../message/message';
import { IMessageHandler } from '../message/IMessageHandler';
import { MouseContext, InputManager } from '../input/InputManager';
import { AudioManager } from '../audio/AudioManager';
import { AnimatedSpriteComponentBuilder } from '../components/AnimatedSpriteComponent';

export class Engine implements IMessageHandler {
  private glContext: GLContext;
  private shader: Shader | undefined;
  private projection: Matrix4x4 | undefined;

  private _previousTime = 0;

  constructor() {
    this.glContext = WebGLUtils.initialize();
    this.loop = this.loop.bind(this);

    console.log('Engine is created.');
  }

  public async start() {
    const { gl } = this.glContext;

    ComponentManager.registerBuilder(new SpriteComponentBuilder());
    ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
    
    BehaviorManager.registerBuilder(new KeyboardMovementBehaviorBuilder());
    BehaviorManager.registerBuilder(new RotationBehaviorBuilder());
    
    AssetManager.initialize();
    InputManager.initialize();
    ZoneManager.initialize(gl);

    Message.subscribe('MOUSE_UP', this);

    gl.clearColor(0, 0, 0.3, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    try {
      this.shader = await AsyncShaderLoader.load('basic', gl, 'resource/shader/vertex-source-1.glsl',
        'resource/shader/fragment-source-1.glsl');
      this.shader.use();

      MaterialManager.registerMaterial(new Material(gl, 'duck', 'resource/assets/textures/duck.png', new Color(0, 128, 255, 255)));
      AudioManager.loadSoundFile("flap", "resource/sounds/flap.mp3", false);

      ZoneManager.changeZone(gl, 0);
    } catch (error) {
      throw new Error(`scene load error: ${error}`);
    }

    this.resize();
    this.loop();

    console.log('Engine is started.');
  }

  private loop() {
    this.update();
    this.render();
  }

  private update() {
    const delta = performance.now() - this._previousTime;

    console.log('delta', delta);

    MessageBus.update(0);
    ZoneManager.update(0);

    this._previousTime = performance.now();
  }

  private render() {
    const { gl } = this.glContext;
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (this.shader !== undefined && this.projection !== undefined) {
      ZoneManager.render(this.shader);

      const projectionPosition = this.shader.getUniformLocation('u_projection');
      gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.projection.data));
    }

    requestAnimationFrame(this.loop);
  }

  public resize() {
    const { gl, cavans } = this.glContext;

    cavans.width = window.innerWidth;
    cavans.height = window.innerHeight;

    gl.viewport(0, 0, cavans.width, cavans.height);
    this.projection = Matrix4x4.orthographic(0, cavans.width, cavans.height, 0, -100.0, 100.0);
  }

  public onMessage(message: Message) {
    if (message.code === 'MOUSE_UP') {
      const context = message.context as MouseContext;
      document.title = `Pos: [${context.position.x},${context.position.y}]`;

      AudioManager.playSound('flap');
    }
  }

}
