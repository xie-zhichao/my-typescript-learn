import { GLBuffer, AttributeInfo } from "../gl/glBuffer";
import { Shader } from "../gl/shaders/shader";
import { Material } from "./material";
import { MaterialManager } from "./materialManager";
import { Matrix4x4 } from "../math/matrix4x4";

/**
 * Sprite
 */
export class Sprite {

  protected _name: string;
  protected width: number;
  protected height: number;

  private gl: WebGLRenderingContext;
  protected buffer: GLBuffer | undefined;
  private materialName: string | undefined;
  private material: Material | undefined;

  public constructor(gl: WebGLRenderingContext, name: string, materialName: string, width: number = 100, height: number = 100) {
    this.gl = gl;
    this._name = name;
    this.materialName = materialName;
    this.material = MaterialManager.getMaterial(materialName);
    this.width = width;
    this.height = height;
  }

  public get name() {
    return this._name;
  }

  public destroy() {
    this.buffer && this.buffer.destroy();
    this.materialName && MaterialManager.releaseMaterial(this.materialName);
    this.material = undefined;
    this.materialName = undefined;
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

  public draw(shader: Shader, model: Matrix4x4): void {
    if (this.buffer === undefined) {
      throw new Error('buffer is not initialized!');
    }

    if (this.material === undefined) {
      throw new Error('material is not initialized!');
    }

    const colorPosition = shader.getUniformLocation('u_tint');
    this.gl.uniform4fv(colorPosition, this.material.tint.toFloat32Array());
    
    const modelPosition = shader.getUniformLocation('u_model');
    this.gl.uniformMatrix4fv(modelPosition, false, model.toFloat32Array());

    if(this.material.diffuseTexture !== undefined) {
      this.material.diffuseTexture.activateAndBind(0);
      const diffuseLocation = shader.getUniformLocation('u_diffuse');
      this.gl.uniform1i(diffuseLocation, 0);
    }
    
    this.buffer.bind();
    this.buffer.draw();
  }

}
