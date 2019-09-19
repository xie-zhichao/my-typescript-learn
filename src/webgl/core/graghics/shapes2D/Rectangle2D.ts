import { IShape2D } from "./IShape2D";
import { Vector2 } from "../../math/vector2";
import { Circle2D } from "./Circle2D";

export class Rectangle2D implements IShape2D {
  public position = Vector2.zero;
  public origin = Vector2.zero;
  public width = 0;
  public height = 0;

  public get offset(): Vector2 {
    return new Vector2(-(this.width * this.origin.x), -(this.height * this.origin.y));
  }

  public setFromJson(json: any) {
    if (json.position !== undefined) {
      this.position.setFromJson(json.position);
    }

    if (json.origin !== undefined) {
      this.origin.setFromJson(json.position);
    }

    if (json.width === undefined) {
      throw new Error('Rectangle2D requires width.');
    }
    this.width = Number(json.width);

    if (json.height === undefined) {
      throw new Error('Rectangle2D requires height.');
    }
    this.height = Number(json.height);
  }

  public intersects(other: IShape2D): boolean {
    if (other instanceof Rectangle2D) {
      return this.pointInShape(other.position) ||
             this.pointInShape(new Vector2(other.position.x + other.width, other.position.y)) ||
             this.pointInShape(new Vector2(other.position.x + other.width, other.position.y + other.height)) ||
             this.pointInShape(new Vector2(other.position.x, other.position.y + other.height));
    }

    if (other instanceof Circle2D) {
      const deltaX = other.position.x - Math.max(this.position.x, Math.min(other.position.x, this.position.x + this.width));
      const deltaY = other.position.y - Math.max(this.position.y, Math.min(other.position.y, this.position.y + this.height));
      return deltaX * deltaX + deltaY * deltaY < other.radius * other.radius;
    }

    return false;
  }

  public pointInShape(point: Vector2): boolean {
    return this.position.x <= point.x && 
           this.position.x + this.width >= point.x &&
           this.position.y <= point.y &&
           this.position.y + this.height >= point.y;
  }
}
