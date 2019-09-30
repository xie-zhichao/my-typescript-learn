namespace L4 {
  // 知识点：抽象类
  abstract class Animal {
    // 知识点：私有成员
    private _name: string;

    // 知识点：存取器
    get name(): string {
      return this._name;
    }

    constructor(name: string) {
      this._name = name;
    }

    // 知识点：抽象方法
    abstract move(distance: number): void;
  }

  // 知识点：实现抽象类的子类
  class Bird extends Animal {
    // 知识点：只读成员
    // 知识点：静态成员
    static readonly classification = 'bird';

    // 知识点：super()
    constructor(name: string) {
      super(name);
    }

    // 知识点：抽象方法实现
    move(distance: number): void {
      console.log(`moved ${distance}.`)
    }
  }

  const enum MoveMode {
    WALK,
    FLY
  }

  // 知识点：子类
  class Owl extends Bird {

    private _mode: MoveMode;

    get mode(): MoveMode {
      console.log('read move mode.');
      return this._mode;
    }

    set mode(mode: MoveMode) {
      console.log('changed move mode.');
      this._mode = mode;
    }

    // 知识点：super()
    constructor(name: string) {
      super(name);
      this._mode = MoveMode.FLY;
    }

    // 知识点：方法覆盖
    move(distance: number): void {
      switch (this._mode) {
        case MoveMode.FLY:
          console.log(`fly ${distance}.`);
          break;
        case MoveMode.WALK:
          console.log(`walked ${distance}.`);
          break;
        default: ;
      }
    }

  }

  let a1 = new Owl('owl');
  console.log(a1.name);
}

