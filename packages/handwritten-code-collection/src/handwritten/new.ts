/**
 * 写法一
 * @param args
 * @returns
 */
function objectFactory(...args: any[]) {
  let newObject = null,
    result = null;
  // shift移除并返回一个参数，args 第一个参数去除
  const constructor = args.shift();
  console.log(constructor);
  if (typeof constructor !== "function") {
    console.error("type error");
    return;
  }
  // 新对象指向构造函数的prototype
  newObject = Object.create(constructor.prototype);
  // this 指向新对象，并执行
  result = constructor.apply(newObject, args);
  const falg =
    result && (typeof result === "object" || typeof result === "function");
  return falg ? result : newObject;
}

/**
 * 写法二
 * @returns
 */
function objectFactory2() {
  let newObject = null,
    result = null;
  const constructor = Array.prototype.shift.call(arguments);
  if (typeof constructor !== "function") {
    console.error("type error");
    return;
  }
  // 新对象的原型为构造函数prototype的原型
  newObject = Object.create(constructor.prototype);
  //   this指向新对象，并执行函数
  result = constructor.apply(newObject, arguments);
  //   判断返回结果，需要返回引用类型
  const flag =
    result && (typeof result === "object" || typeof result === "function");
  return flag ? result : newObject;
}
function a(b: any) {
  this.d = b;
}
const c = objectFactory2(a, 1);
console.log(c, c.d);

const s = new a(1);
console.log(s, s.d);
