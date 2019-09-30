// boolean
let success: boolean = true;
// number
let num1: number = 12;
let num2: number = 0xab; // 支持多种进制
// string
let str1: string = 'abc';

let arr1: string[] = ['hello', 'world'];
let arr2: Array<string> = ['hello', 'world'];

let arr3: [string, number] = ['hello', 123];

// enum
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName);  // 显示'Green'因为上面代码里它的值是2

// object
let a: object = new Date();
a.hasOwnProperty('name'); // ok
// a.getDate(); // error

// never
function bizError(_code: number, msg: string): never {
  throw new Error(msg); 
}

// 尖括号式
let var1: any = 'abc';
console.log((<string>var1).substring(1));

// as
let var2: object = new Array<number>();
console.log((var2 as Array<number>).push(1));

// 类型推断
let b = 'abc';
console.log(b.substring(1));

// 解构
let obj1 = {
    str123: 'abc',
    num123: 123
};

let { str123, num123 } = obj1;
