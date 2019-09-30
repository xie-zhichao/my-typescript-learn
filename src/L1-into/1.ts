// TypeScript
// 静态的类型声明
export function formatA(var1: string): string {
  let ret: string = '[log]' + var1;
  return ret;
}

export interface User {
  userid: number,
  username: string,
  userTags?: Array<string>
}

export const fetch = function (_url: string | object, _params?: any, _user?: User): Promise<object | Error> {
  // dosomething
  return Promise.resolve({});
}