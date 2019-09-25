import { IBehaviorData } from "./IBehaviorData";
import { Vector2 } from "../math/vector2";
import { IBehaviorBuilder } from "./IBehaviorBuilder";
import { IBehavior } from "./IBehavior";
import { BaseBehavior } from "./BaseBehavior";
import { IMessageHandler } from "../message/IMessageHandler";
import { Message } from "../message/message";

export class ScrollBehaviorData implements IBehaviorData {
  public name: string | undefined;
  public velocity = Vector2.zero;
  public minPosition = Vector2.zero;
  public resetPosition = Vector2.zero;
  public startMessage: string | undefined;
  public stopMessage: string | undefined;
  public resetMessage: string | undefined;

  public minResetY = 0;
  public maxResetY = 0;

  public setFromJson(json: any): void {
    if (json.name === undefined) {
      throw new Error("Name must be defined in behavior data.");
    }

    this.name = String(json.name);

    if (json.startMessage !== undefined) {
      this.startMessage = String(json.startMessage);
    }

    if (json.stopMessage !== undefined) {
      this.stopMessage = String(json.stopMessage);
    }

    if (json.resetMessage !== undefined) {
      this.resetMessage = String(json.resetMessage);
    }

    if (json.velocity !== undefined) {
      this.velocity.setFromJson(json.velocity);
    } else {
      throw new Error("ScrollBehaviorData requires property 'velocity' to be defined!");
    }

    if (json.minPosition !== undefined) {
      this.minPosition.setFromJson(json.minPosition);
    } else {
      throw new Error("ScrollBehaviorData requires property 'minPosition' to be defined!");
    }

    if (json.resetPosition !== undefined) {
      this.resetPosition.setFromJson(json.resetPosition);
    } else {
      throw new Error("ScrollBehaviorData requires property 'resetPosition' to be defined!");
    }

    if (json.minResetY !== undefined) {
      this.minResetY = Number(json.minResetY);
    }

    if (json.maxResetY !== undefined) {
      this.maxResetY = Number(json.maxResetY);
    }
  }
}

export class ScrollBehaviorBuilder implements IBehaviorBuilder {
  public get type(): string {
    return "scroll";
  }

  public buildFromJson(json: any): IBehavior {
    let data = new ScrollBehaviorData();
    data.setFromJson(json);
    return new ScrollBehavior(data);
  }
}

export class ScrollBehavior extends BaseBehavior implements IMessageHandler {
  private _velocity = Vector2.zero;
  private _minPosition = Vector2.zero;
  private _resetPosition = Vector2.zero;
  private _startMessage: string | undefined;
  private _stopMessage: string | undefined;
  private _resetMessage: string | undefined;
  private _isScrolling = false;
  private _initialPosition = Vector2.zero;
  private _minResetY = 0;
  private _maxResetY = 0;

  public constructor(data: ScrollBehaviorData) {
    super(data);

    this._velocity.copyFrom(data.velocity);
    this._minPosition.copyFrom(data.minPosition);
    this._resetPosition.copyFrom(data.resetPosition);
    this._startMessage = data.startMessage;
    this._stopMessage = data.stopMessage;
    this._resetMessage = data.resetMessage;

    if (data.minResetY !== undefined) {
      this._minResetY = data.minResetY;
    }

    if (data.maxResetY !== undefined) {
      this._maxResetY = data.maxResetY;
    }
  }

  public updateReady(): void {
    super.updateReady();

    if (this._startMessage !== undefined) {
      Message.subscribe(this._startMessage, this);
    }

    if (this._stopMessage !== undefined) {
      Message.subscribe(this._stopMessage, this);
    }

    if (this._resetMessage !== undefined) {
      Message.subscribe(this._resetMessage, this);
    }

    if (this._owner === undefined) {
      throw new Error("owner is undefined.");
    }

    this._initialPosition.copyFrom(this._owner.transform.position.toVector2());
  }

  public update(time: number): void {
    if (this._isScrolling) {
      if (this._owner === undefined) {
        throw new Error("owner is undefined.");
      }
      this._owner.transform.position.add(this._velocity.clone().scale(time / 1000).toVector3());

      let scrollY = this._minResetY !== undefined && this._maxResetY !== undefined;
      if (this._owner.transform.position.x <= this._minPosition.x &&
        (scrollY || (!scrollY && this._owner.transform.position.y <= this._minPosition.y))) {

        this.reset();
      }
    }
  }

  public onMessage(message: Message): void {
    if (message.code === this._startMessage) {
      this._isScrolling = true;
    } else if (message.code === this._stopMessage) {
      this._isScrolling = false;
    } else if (message.code === this._resetMessage) {
      this.initial();
    }
  }

  private reset(): void {
    if (this._owner === undefined) {
      throw new Error("owner is undefined.");
    }
    this._owner.transform.position.copyFrom(this._resetPosition.toVector3());
    if (this._minResetY !== undefined && this._maxResetY !== undefined) {
      this._owner.transform.position.set(this._resetPosition.x, this.getRandomY());
    } else {
      this._owner.transform.position.copyFrom(this._resetPosition.toVector3());
    }
  }

  private getRandomY(): number {
    // Inclusive of the min and max set in the data.
    return Math.floor(Math.random() * (this._maxResetY - this._minResetY + 1)) + this._minResetY;
  }

  private initial(): void {
    if (this._owner === undefined) {
      throw new Error("owner is undefined.");
    }
    this._owner.transform.position.copyFrom(this._initialPosition.toVector3());
  }
}