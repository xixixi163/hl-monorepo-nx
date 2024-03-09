const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";

// 构造函数
function MyPromise(fn) {
  // 保存初始化状态
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  var self = this;

  // 初始化状态
  this.state = PENDING;

  // 用于保存 resolve 或者 rejected 传入的值
  this.value = null;

  // 用于保存 resolve 的回调函数
  this.resolvedCallbacks = [];

  // 用于保存 reject 的回调函数
  this.rejectedCallbacks = [];

  // 状态转变为 resolve 的方法
  function resolve(value) {
    // 判断传入元素是否为 Promise 值，如果是，则状态改变必须等待前一个状态改变后再进行改变
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }

    // 保证代码的执行顺序为本轮事件循环的末尾，已注册完所有callback
    setTimeout(() => {
      // 只有状态为 pending 时才能转变
      if (self.state === PENDING) {
        // 修改状态
        self.state = RESOLVED;

        // 设置传入的值
        self.value = value;

        // 执行回调函数
        self.resolvedCallbacks.forEach((callback) => {
          callback(value);
        });
      }
    }, 0);
  }

  //   状态转变为 rejected 的方法
  function reject(value) {
    // 保证代码的执行顺序为本轮事件循环的末尾
    setTimeout(() => {
      // 只有状态为 pending 时才能转变
      if (self.state === PENDING) {
        // 修改状态
        self.state = REJECTED;

        // 设置传入的值
        self.value = value;

        // 执行回调函数
        self.rejectedCallbacks.forEach((callback) => {
          callback(value);
        });
      }
    }, 0);
  }

  // new Promise((resolve, reject)=>{})
  // 将两个方法传入函数执行
  try {
    // 执行传给构造函数的 方法
    fn(resolve, reject);
  } catch (error) {
    // 遇到错误时，捕获错误，执行 reject 函数
    reject(error);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  // 首先判断两个参数是否为函数类型，因为这两个参数是可选参数
  onResolved =
    typeof onResolved === "function"
      ? onResolved
      : //   如果传入的不是函数，会包装成函数
        function (value) {
          return value;
        };

  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : function (error) {
          throw error;
        };

  // 如果是等待状态，则将函数加入对应列表中
  if (this.state === PENDING) {
    this.resolvedCallbacks.push(onResolved);
    this.rejectedCallbacks.push(onRejected);
  }

  // 如果状态已凝固，则直接执行对应状态的函数
  if (this.state === RESOLVED) {
    onResolved(this.value);
  }

  if (this.state === REJECTED) {
    onRejected(this.value);
  }
};

/**
 * 执行顺序
 * 1、创建构造函数，执行构造函数
 *   1.1 执行构造函数的fn，也就是a'处
 *   1.2 遇到setTimeout 放到宏任务队列
 * 2、then先执行，把onResolved 存到 resolvedCallbacks
 * 3、执行 a 处，同步宏任务console.log('a') 先执行，再进到构造函数 mypromise 的 resolve 函数
 * 4、执行 resolve，
 *   4.1 判断 value 是否为 myPromise，是的话继续走then 存储，待实例内部调用到构造函数resolve后执行。
 *   4.2 由于内部要执行顺序为本轮事件循环的末尾，又使用了 setTimeout，在里面执行 resolvedCallbacks
 *   4.2 执行callbacks，内部有传入 then 的函数，然后就会输出‘b'
 */
console.log(
  new MyPromise((resolve, reject) => {
    // ---a‘---
    setTimeout(() => {
      // ----a----
      resolve("b");
      console.log("a");
    }, 0);
  }).then((res) => {
    console.log(res);
  })
);

Promise.resolve(1)
  .then((res) => {
    console.log(res);
    return 2;
  })
  .catch((err) => {
    return 3;
  })
  .then((res) => {
    console.log(res);
  });

console.log(
  Promise.resolve(1).catch((err) => {
    return 3;
  }),
  new Promise((resolve) => resolve(3)).then((res) => console.log(res)),
  "----------"
);
