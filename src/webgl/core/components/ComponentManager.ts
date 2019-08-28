import { IComponentBuilder } from "./IComponentBuilder";
import { IComponent } from "./IComponent";

export class ComponentManager {
  private static _registeredBuilders: {[type: string]: IComponentBuilder} = {};

  public static registerBuilder(builder: IComponentBuilder): void {
    ComponentManager._registeredBuilders[builder.type] = builder;
  }

  public static extractComponent(json: any): IComponent {
    if (json.type !== undefined) {
      const builder = ComponentManager._registeredBuilders[String(json.type)];
      if (builder !== undefined) {
        return builder.buildFromJson(json);
      }
    }

    throw new Error("Component manager error - type is missing or builder is not registered for this type.");
  }

  private constructor() {}
  
}