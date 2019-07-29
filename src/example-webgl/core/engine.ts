/**
 * 渲染引擎
 */
import { WebGLUtils, GLContext } from './gl';

export class Engine {
  private glContext: GLContext;

  constructor() {
    this.glContext = WebGLUtils.initialize();
    this.loop = this.loop.bind(this);

    console.log('Engine is created.')
  }

  start() {
    const { gl } = this.glContext;
    gl.clearColor(1, 0, 0, 1);
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
}