import { Vector3 } from "./vector3";

export class Vector2 {

  private _x: number;
  private _y: number;

  /**
   * Creates a new vector 2.
   * @param x The x component.
   * @param y The y component.
   */
  public constructor(x: number = 0, y: number = 0) {
      this._x = x;
      this._y = y;
  }

  /** The x component. */
  public get x(): number {
      return this._x;
  }

  /** The x component. */
  public set x(value: number) {
      this._x = value;
  }

  /** The y component. */
  public get y(): number {
      return this._y;
  }

  /** The y component. */
  public set y(value: number) {
      this._y = value;
  }

  public static get zero(): Vector2 {
      return new Vector2();
  }

  public static get one(): Vector2 {
      return new Vector2(1, 1);
  }

  public static distance(a: Vector2, b: Vector2): number {
      let diff = a.clone().subtract(b);
      return Math.sqrt(diff.x * diff.x + diff.y * diff.y);
  }

  public copyFrom(v: Vector2): void {
      this._x = v._x;
      this._y = v._y;
  }

  /** Returns the data of this vector as a number array. */
  public toArray(): number[] {
      return [this._x, this._y];
  }

  /** Returns the data of this vector as a Float32Array. */
  public toFloat32Array(): Float32Array {
      return new Float32Array(this.toArray());
  }

  public toVector3(): Vector3 {
      return new Vector3(this._x, this._y, 0);
  }

  public set(x?: number, y?: number): void {
      if (x !== undefined) {
          this._x = x;
      }

      if (y !== undefined) {
          this._y = y;
      }
  }

  public setFromJson(json: any): void {
      if (json.x !== undefined) {
          this._x = Number(json.x);
      }

      if (json.y !== undefined) {
          this._y = Number(json.y);
      }
  }

  public add(v: Vector2): Vector2 {
      this._x += v._x;
      this._y += v._y;

      return this;
  }

  public subtract(v: Vector2): Vector2 {
      this._x -= v._x;
      this._y -= v._y;

      return this;
  }

  public multiply(v: Vector2): Vector2 {
      this._x *= v._x;
      this._y *= v._y;

      return this;
  }

  public divide(v: Vector2): Vector2 {
      this._x /= v._x;
      this._y /= v._y;

      return this;
  }

  public scale(scale: number): Vector2 {
      this._x *= scale;
      this._y *= scale;

      return this;
  }

  public clone(): Vector2 {
      return new Vector2(this._x, this._y);
  }
}
