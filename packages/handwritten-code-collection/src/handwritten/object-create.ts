/**
 * Object.create()
 * 在 JavaScript 中，通过设置对象的原型来实现继承是一种常见的方式，称为原型继承（prototype inheritance）。
 * 原型继承允许一个对象继承另一个对象的属性和方法，从而实现代码的复用和组织。
 * @param proto
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function create<T>(proto: T): T {
  // 创建一个构造函数
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function F() {}
  //  将构造函数的原型设置为指定的原型对象
  //  这个新对象的原型指向了 proto，因此它可以继承 proto 上的属性和方法。
  (F as any).prototype = proto;
  //   使用 new 运算符创建一个新对象，并将新对象的原型设置为proto
  return new (F as any)();
}

interface Person {
  greet(): void;
}

const personProto: Person = {
  greet: function () {
    console.log("hello");
  },
};

const john = create<Person>(personProto);
john.greet();
