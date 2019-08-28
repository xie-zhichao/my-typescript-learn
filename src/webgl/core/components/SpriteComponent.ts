import { IComponentData } from "./IComponentData";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./baseComponent";
import { Sprite } from "../graghics/sprite";
import { Shader } from "../gl/shaders/shader";

export class SpriteComponentData implements IComponentData {
  public name: string | undefined;
  public materialName: string | undefined;

  public setFromJson(json: any): void {
    if (json.name !== undefined) {
      this.name = String(json.name);
    }

    if (json.materialName !== undefined) {
      this.materialName = String(json.materialName);
    }
  }
}

export class SpriteComponentBuilder {
  public get type(): string {
    return 'sprite';
  }

  public buildFromJson(gl: WebGLRenderingContext, json: any): IComponent {
    const data = new SpriteComponentData();
    data.setFromJson(json);
    return new SpriteComponent(gl, data);
  }
}

export class SpriteComponent extends BaseComponent {
  private _sprite: Sprite;

  public constructor(gl: WebGLRenderingContext, data: SpriteComponentData) {
    super(data);

    if (data.materialName === undefined) {
      throw new Error('create SpriteComponent error, materialName undefined.');
    }

    this._sprite = new Sprite(gl, name, data.materialName);
  }

  public load(): void {
    this._sprite.load();
  }

  public render(shader: Shader): void {
    if (this.owner === undefined) {
      throw new Error('render SpriteComponent error, owner undefined.');
    }
    
    this._sprite.draw(shader, this.owner.worldMatrix);
  }
}
