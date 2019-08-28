import { IComponent } from "./IComponent";
import { SimObject } from "../world/simObject";
import { IComponentData } from "./IComponentData";
import { Shader } from "../gl/shaders/shader";

export abstract class BaseComponent implements IComponent {
  public owner: SimObject | undefined;
  public name: string | undefined;

  protected _data: IComponentData;

  public constructor(data: IComponentData) {
    this._data = data;
    this.name = data.name;
  }

  public getOwner(): SimObject | undefined {
    return this.owner;
  }

  public setOwner(owner: SimObject): void {
    this.owner = owner;
  }

  public load(): void { }

  public updateReady(): void { }

  public update(time: number): void { }

  public render(shader: Shader): void { }
}
