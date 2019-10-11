namespace L8_1 {

  interface IAnyObject {
    [prop: string]: any
  }

  /**
   * 交叉类型示例 
   */
  function extend<First extends IAnyObject, Second extends IAnyObject>(first: First, second: Second): First & Second {
    const result: Partial<First & Second> = {};
    for (const prop in first) {
      if (first.hasOwnProperty(prop)) {
        (result as First)[prop] = first[prop];
      }
    }
    for (const prop in second) {
      if (second.hasOwnProperty(prop)) {
        (result as Second)[prop] = second[prop];
      }
    }
    return result as First & Second;
  }

  interface IPerson {
    name: string,
    age: number
  }

  interface IOrdered {
    serialNo: number,
    getSerialNo(): number
  }

  const personA: IPerson = {
    name: 'Jim',
    age: 20
  }

  const orderOne: IOrdered = {
    serialNo: 1,
    getSerialNo: function () { return this.serialNo }
  }

  const personAOrdered = extend<IPerson, IOrdered>(personA, orderOne);
  console.log(personAOrdered.getSerialNo());

  /**
   * 联合类型示例1
   */
  function padLeft(value: string, padding: number | string) {
    if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
    }
    if (typeof padding === "string") {
      return padding + value;
    }
    return value;
  }

  padLeft("Hello world", 4);

  /**
   * 联合类型示例2
   */
  type Scores = 1 | 2 | 3 | 4 | 5;

  function rating(score: Scores) {
    console.log(`Set score ${score}`);
  }

  rating(3);
  // error
  // rating(6); 
}
