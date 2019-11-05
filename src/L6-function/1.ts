namespace L6_function {

  class C1 {
    hello(): string {
      return 'Hello, C1!';
    }
  }

  class C2 extends C1 {
    hello(): string {
      return 'Hello, C2!';
    }
  }

  type C3 = Readonly<C1>;

  class Animal {

  }

  class Bee extends Animal {

  }

  class Lion extends Animal {

  }

  // 这里还是个单例模式
  class AnimalFactory {
    private static instance: AnimalFactory;

    private constructor() { };

    static getInstance(): AnimalFactory {
      if (!AnimalFactory.instance) {
        AnimalFactory.instance = new AnimalFactory();
      }

      return AnimalFactory.instance;
    }

    // 注意看这个方法的参数
    create<A extends Animal>(c: new () => A): A {
      return new c();
    }
  }


  const add = (x: number, y: number) => x + y;

  console.log(add(1, 2));

  function myLog(message: string, level: ('info' | 'warn' | 'error') = 'info', prefix?: string): void {
    // todo, logging
  }

  function myCallback(status: boolean, ...restData: any[]) {
    console.log(`${status}: ${restData.join()}`);
  }

  myCallback(true);
  myCallback(true, '完成一个');
  myCallback(true, '完成第一个', '完成第二个');

  interface Lottery {
    prizes: string[];
    getDraw(): { (name: string): string };
  }

  const myLottery: Lottery = {
    prizes: ['pen', 'pencil', 'notebook', 'dictionary'],
    getDraw: function () {
      return function (this: Lottery, name: string) {
        const result = Math.floor(Math.random() * 4);
        return `Bingo, ${name}, you win the ${this.prizes[result]}!`;
      }.bind(this);
    }
  }

  const myDraw = myLottery.getDraw();
  console.log(myDraw('Tom'));


  function myAdd(x: number, y: number): number;
  function myAdd(x: string, y: string): string;
  function myAdd(x: any, y: any): any {
    if (typeof x === 'number' && typeof y === 'number') {
      return x + y;
    } else if (typeof x === 'string' && typeof y === 'string') {
      return x + y;
    }
  }

  myAdd(1, 2);
  myAdd('Hello', 'world');

  // 数组元素自增
  let arr = [1, 2, 3];

  // 传统方式
  for (let i = 0; i < arr.length; i++) {
    arr[i]++;
  }

  // map
  arr = arr.map(function (item) {
    return item + 1;
  });

  // 结合箭头函数
  arr = arr.map(item => item + 1);

  interface MyRequest {
    (url: string, options: { [key: string]: any }): Promise<any>;
  }

  function withLog(func: MyRequest): MyRequest {
    return function (url: string, options: { [key: string]: any }) {
      console.log('request');
      return func(url, options);
    };
  }

  function myRequest(url: string, options: { [key: string]: any }) {
    return new Promise(function (resolve) {
      setTimeout(() => {
        resolve('completed!')
      }, 1000);
    });
  }

  withLog(myRequest)('/a', { method: 'post' }).then(val => {
    console.log(val);
  })

  function withLog2(func: MyRequest): MyRequest {
    return function (url: string, options: { [key: string]: any }) {
      return func(url, options).then(val => {
        return `[${val}]`;
      });
    };
  }

  withLog2(withLog(myRequest))('/a', { method: 'post' }).then(val => {
    console.log(val);
  })

}
