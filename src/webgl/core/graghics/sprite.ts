import { GLBuffer, AttributeInfo } from "../gl/glBuffer";
import { Vector3 } from "../math/vector3";

/**
 * Sprite
 */
export class Sprite {

  protected name: string;
  protected width: number;
  protected height: number;

  private gl: WebGLRenderingContext;
  protected buffer: GLBuffer | undefined;

  public position: Vector3 = new Vector3();

  public constructor(gl: WebGLRenderingContext, name: string, width: number = 100, height: number = 100) {
    this.name = name;
    this.width = width;
    this.height = height;

    this.gl = gl;
  }

  public load(): void {
    this.buffer = new GLBuffer(this.gl);

    const positonAttribute = new AttributeInfo(0, 3, 0);
    this.buffer.addAttributeLocation(positonAttribute);

    const vertices = [
      0, 0, 0,
      0, this.height, 0,
      this.width, this.height, 0,
      this.width, this.height, 0,
      this.width, 0, 0,
      0, 0, 0
    ];

    this.buffer.pushBackData(vertices);
    this.buffer.upload();
    this.buffer.unbind();
  }

  public update(time: number): void {
    console.log(time);
  }

  public draw(): void {
    if (this.buffer === undefined) {
      throw new Error('buffer is not initialized!');
    }
    this.buffer.bind();
    this.buffer.draw();
  }

}
