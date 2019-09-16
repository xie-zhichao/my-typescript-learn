import { Vector2 } from "../math/vector2";
import { IMessageHandler } from "../message/IMessageHandler";
import { Sprite } from "./sprite";
import { Message } from "../message/message";
import { MESSAGE_ASSET_LOADER_ASSET_LOADED } from "../assets/assetManager";
import { ImageAsset } from "../assets/imageAssetLoader";

class UVInfo {
  public min: Vector2;
  public max: Vector2;

  public constructor(min: Vector2, max: Vector2) {
    this.min = min;
    this.max = max;
  }
}

export class AnimatedSprite extends Sprite implements IMessageHandler {
  private _frameWidth: number;
  private _frameHeight: number;
  private _frameCount: number;
  private _frameSequence: number[];

  private _frameTime = 333;
  private _frameUVs: UVInfo[] = [];

  private _currentFrame = 0;
  private _currentTime = 0;
  private _assetLoaded = false;
  private _assetWidth = 2;
  private _assetHeight = 2;

  public constructor(gl: WebGLRenderingContext, name: string, materialName: string, width = 100, height = 100,
    frameWidth = 10, frameHeight = 10, frameCount = 10, frameSequence: number[] = []) {
    super(gl, name, materialName, width, height);

    this._frameWidth = frameWidth;
    this._frameHeight = frameHeight;
    this._frameCount = frameCount;
    this._frameSequence = frameSequence;

    Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.material!.diffuseTextureName, this);
  }

  public destroy() {
    super.destroy();
  }

  public onMessage(message: Message) {
    if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.material!.diffuseTextureName) {
      this._assetLoaded = true;
      const asset = message.context as ImageAsset;
      this._assetWidth = asset.width;
      this._assetHeight = asset.height;

      this.caculateUVs();
    }
  }

  public load() {
    super.load();
  }

  public update(time: number) {
    if (!this._assetLoaded) {
      return;
    }

    this._currentTime += time;
    if (this._currentTime > this._frameTime) {
      if (this.buffer === undefined) {
        throw new Error('buffer is not initialized!');
      }

      this._currentFrame++;
      this._currentTime = 0;

      if (this._currentFrame >= this._frameSequence.length) {
        this._currentFrame = 0;
      }

      const frameUVs = this._frameSequence[this._currentFrame];
      this.vertices[0].texCoords.copyFrom(this._frameUVs[frameUVs].min);
      this.vertices[1].texCoords.copyFrom(new Vector2(this._frameUVs[frameUVs].min.x, this._frameUVs[frameUVs].max.y));
      this.vertices[2].texCoords.copyFrom(this._frameUVs[frameUVs].max);
      this.vertices[3].texCoords.copyFrom(this._frameUVs[frameUVs].max);
      this.vertices[4].texCoords.copyFrom(new Vector2(this._frameUVs[frameUVs].max.x, this._frameUVs[frameUVs].min.y));
      this.vertices[5].texCoords.copyFrom(this._frameUVs[frameUVs].min);

      for (const v of this.vertices) {
        this.buffer.pushBackData(v.toArray());
      }

      this.buffer.upload();
      this.buffer.unbind();
    }

    super.update(time);
  }

  private caculateUVs() {
    let totalWidth = 0;
    let yValue = 0;

    for (let i = 0; i < this._frameCount; i++) {
      totalWidth += i * this._frameWidth;
      if (totalWidth > this._assetWidth) {
        yValue++;
        totalWidth = 0;
      }

      let u = (i * this._frameWidth) / this._assetHeight;
      let v = (yValue * this._frameHeight) / this._assetHeight;
      let min: Vector2 = new Vector2(u, v);

      let uMax = ((i * this._frameWidth) + this._frameWidth) / this._assetWidth;
      let vMax = ((yValue * this._frameHeight) + this._frameHeight) / this._assetHeight;
      let max = new Vector2(uMax, vMax);

      this._frameUVs.push(new UVInfo(min, max));
    }
  }
}
