namespace L3 {
  // 声明数据类型
  interface CustomerInfo {
    customerCode: string;
    customerName: string;
  }

  // 使用数据类型
  function helloCustomer(customerInfo: CustomerInfo) {
    console.log(`Hello, ${customerInfo.customerName}!`);
  }

  helloCustomer({ customerCode: '1001', customerName: 'Jee' }); // ok
  // helloCustomer({ customerName: 'Jee' }); // error, Property 'customerCode' is missing

  /**
   * 面向对象
   */

  // 接口声明
  interface Animal {
    name: string;
  }

  // 接口继承
  interface Mammal extends Animal {
    legNum: number;
    sound(): string;
  }

  // 类实现
  class Bull implements Mammal {
    name: string;
    legNum: number;

    constructor(name: string) {
      this.name = name;
      this.legNum = 4;
    }

    sound() {
      return 'moo';
    }
  }

  // 实例
  let bull1 = new Bull('bull1');
  console.log(bull1.sound()); // moo

  /**
   * 更多用法
   */

  interface CustomerInfo {
    customerCode: string;
    customerName: string;
    customerAddr?: string; // 可选属性
  }

  interface CustomerInfo {
    customerCode: string;
    customerName: string;
    customerAddr?: string; // 可选属性
    [key: string]: any; // 其他任意名称，任意类型的属性
  }

  interface CustomerInfo {
    customerCode: string;
    customerName: string;
    greeting?: string;
    readonly standardGreeting?: string; // 只读属性
  }

  interface SearchFunc {
    (content: string, key: string): boolean;
  }

  // 这里参数名可以不一样，类型也可以省略
  let mySearchFunc: SearchFunc = (c, k) => {
    return c.search(k) > -1;
  }

  console.log(mySearchFunc('hello world', 'hello'));
}

