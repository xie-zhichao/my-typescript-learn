import { GLBuffer, AttributeInfo } from "../gl/glBuffer";
import { Vector3 } from "../math/vector3";
import { Texture } from "./texture";
import { TextureManager } from "./textureManager";
import { Shader } from "../gl/shader";

/**
 * Sprite
 */
export class Sprite {

  protected _name: string;
  protected width: number;
  protected height: number;

  private gl: WebGLRenderingContext;
  protected buffer: GLBuffer | undefined;
  private textureName: string;
  private texture: Texture;

  public position: Vector3 = new Vector3();

  public constructor(gl: WebGLRenderingContext, name: string, textureName: string, width: number = 100, height: number = 100) {
    this.gl = gl;
    this._name = name;
    this.textureName = textureName;
    this.texture = TextureManager.getTexture(gl, textureName);
    this.width = width;
    this.height = height;
  }

  public get name() {
    return this._name;
  }

  public destroy() {
    this.buffer && this.buffer.destroy();
    TextureManager.releaseTexture(this.textureName);
  }

  public load(): void {
    this.buffer = new GLBuffer(this.gl);

    const positonAttribute = new AttributeInfo(0, 3, 0);
    this.buffer.addAttributeLocation(positonAttribute);

    const texCoordArribute = new AttributeInfo(1, 2, 3);
    this.buffer.addAttributeLocation(texCoordArribute);

    const vertices = [
      0, 0, 0, 0, 0,
      0, this.height, 0, 0, 1.0,
      this.width, this.height, 0, 1.0, 1.0,
      this.width, this.height, 0, 1.0, 1.0,
      this.width, 0, 0, 1.0, 0,
      0, 0, 0, 0, 0
    ];

    this.buffer.pushBackData(vertices);
    this.buffer.upload();
    this.buffer.unbind();
  }

  public update(time: number): void {
    console.log(time);
  }

  public draw(shader: Shader): void {
    if (this.buffer === undefined) {
      throw new Error('buffer is not initialized!');
    }
    this.texture.activateAndBind(0);
    const diffuseLocation = shader.getUniformLocation('u_diffuse');
    this.gl.uniform1i(diffuseLocation, 0);
    this.buffer.bind();
    this.buffer.draw();
  }

}
