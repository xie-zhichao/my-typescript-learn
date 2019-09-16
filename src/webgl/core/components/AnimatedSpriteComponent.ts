import { SpriteComponentData } from "./SpriteComponent";
import { IComponentData } from "./IComponentData";
import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";
import { BaseComponent } from "./baseComponent";
import { AnimatedSprite } from "../graghics/AnimatedSprite";
import { Shader } from "../gl/shaders/shader";

export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {
  public frameWidth: number | undefined;
  public frameHeight: number | undefined;
  public frameCount: number | undefined;
  public frameSequence: number[] = [];

  public setFromJson(json: any): void {
    super.setFromJson(json);

    if (json.frameWidth === undefined) {
      throw new Error('AnimatedSpriteComponentData requires "frameWidth".');
    } else {
      this.frameWidth = Number(json.frameWidth);
    }

    if (json.frameHeight === undefined) {
      throw new Error('AnimatedSpriteComponentData requires "frameHeight".');
    } else {
      this.frameHeight = Number(json.frameHeight);
    }

    if (json.frameCount === undefined) {
      throw new Error('AnimatedSpriteComponentData requires "frameCount".');
    } else {
      this.frameCount = Number(json.frameCount);
    }

    if (json.frameSequence === undefined) {
      throw new Error('AnimatedSpriteComponentData requires "frameSequence".');
    } else {
      this.frameSequence = json.frameSequence;
    }
  }
}

export class AnimatedSpriteComponentBuilder implements IComponentBuilder {
  public get type(): string {
    return 'animatedSprite';
  }

  public buildFromJson(gl: WebGLRenderingContext, json: any): IComponent {
    const data = new AnimatedSpriteComponentData();
    data.setFromJson(json);
    return new AnimatedSpriteComponent(gl, data);
  }
}

export class AnimatedSpriteComponent extends BaseComponent {
  private _sprite: AnimatedSprite;

  public constructor(gl: WebGLRenderingContext, data: AnimatedSpriteComponentData) {
    super(data);

    if (this.name === undefined ||data.materialName === undefined) {
      throw new Error('create AnimatedSpriteComponent error, name or materialName undefined.');
    }

    this._sprite = new AnimatedSprite(gl, this.name, data.materialName, data.frameWidth, 
      data.frameHeight, data.frameWidth, data.frameHeight, data.frameCount, data.frameSequence);
  }

  public load() {
    this._sprite.load();
  }

  public update(time: number) {
    this._sprite.update(time);

    super.update(time);
  }

  public render(shader: Shader) {
    if (this.owner === undefined) {
      throw new Error('owner is undefined.');
    }
    this._sprite.draw(shader, this.owner.worldMatrix);

    super.render(shader);
  }
}
