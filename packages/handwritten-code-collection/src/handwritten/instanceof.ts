/**
 * Object.getPrototypeOf({a:1})===Object.prototype => {a:1}的__proto__（原型链） 等于 Object构造函数的prototype（原型）
 * 因为__proto__指向该对象的原型
 * {a:1} instanceof Object
 */
function myInstanceof(left: any, right: any) {
  let proto = Object.getPrototypeOf(left),
    // eslint-disable-next-line prefer-const
    prototype = right.prototype;

  console.log(proto, prototype);

  // 判断构造函数的 prototype 对象是否在对象的原型链上
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!proto) return false; // 已经到达原型链的顶部
    // // 当前原型 proto 等于构造函数的原型 prototype，则返回 true，表示对象 left 是构造函数 right 的实例
    if (proto === prototype) return true;

    // 继续向上遍历原型链，将当前原型的原型设置为新的 proto，以便下一轮循环继续判断。
    proto = Object.getPrototypeOf(proto);
  }
}

class Person {}

const person = new Person();

console.log(myInstanceof(person, Person)); // 输出 true
console.log(myInstanceof(person, Array)); // 输出 false
console.log(myInstanceof("abx", String));
console.log(myInstanceof({ a: 1 }, Number));

/**
 * `prototype` 和 `__proto__` 是 JavaScript 中原型相关的两个重要属性，它们之间有一些区别：

1. `prototype` 是函数对象（函数构造器）特有的属性，而 `__proto__` 是所有对象都有的属性。
当我们创建一个函数时，函数对象会自动拥有一个 prototype 属性，它指向一个对象，这个对象就是该函数的原型对象。
原型对象是用来存储该函数的共享属性和方法的地方。

2. `prototype` 是函数对象的一个属性，它指向了一个对象，这个对象包含了构造函数所定义的所有属性和方法。
当用 `new` 关键字创建一个实例时，这个实例的 `__proto__` 属性会指向构造函数的 `prototype` 属性。

   ```javascript
   function Foo() {}
   console.log(Foo.prototype); // 输出：Foo {}
   ```

3. `__proto__` 是每个对象（实例）都有的一个属性，它指向了该对象的原型对象。通过 __proto__ 属性，JavaScript 实现了对象之间的继承关系，构成了原型链。
当我们访问一个对象的属性或方法时，如果该对象本身没有这个属性或方法，JavaScript 就会沿着原型链去查找对象的原型对象，直到找到为止。

   ```javascript
   const obj = {};
   console.log(obj.__proto__); // 输出：Object {}
   ```

4. 在 ES5 之前，没有标准化的方法来访问和修改对象的原型。然而，`__proto__` 属性可以用来访问和修改对象的原型，但它不是 ECMAScript 标准的一部分，不推荐直接使用。相比之下，`prototype` 属性是标准的，用于定义构造函数的原型。

总的来说，`prototype` 属性是用于定义构造函数的原型，而 `__proto__` 属性是用于访问和修改对象的原型链。在实际开发中，我们通常不直接操作 `__proto__` 属性，而是通过构造函数的 `prototype` 属性来定义原型，并通过实例的 `__proto__` 属性来访问原型链。

// 已弃用。这里只是举个例子，请不要在生产环境中这样做。
shape.__proto__ = circle;
 */
