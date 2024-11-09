/**
 * 真正的链式 Promise 是指在当前 Promise 达到 fulfilled 状态后，即开始进行下一个 Promise（后邻 Promise）。
 * 那么我们如何衔接当前 Promise 和后邻 Promise 呢？
 * - then 方法中，创建并返回了新的 Promise 实例，这是串行Promise的基础，是实现真正链式调用的根本。
 * - then 方法传入的形参 onFulfilled 以及创建新 Promise 实例时传入的 resolve 放在一起，被
 *   push到当前 Promise 的 callbacks 队列中，这是衔接当前 Promise 和后邻 Promise 的关键所在。
 * - 根据规范，onFulfilled 是可以为空的，为空时不调用 onFulfilled
 */
const PENDING = "pending";
const FULFILLRD = "fulfilled";
const REJECTED = "rejected";

/**
 * 构造函数，宏任务执行then/catch的回调
 * @param {*} fn 回调 fn(resolve,reject)
 */
function MyPromise(fn) {
  var self = this;
  this.value = null;
  this.state = PENDING;
  this.resolvedCallbacks = [];
  this.rejectedCallbacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }

    // 放到宏任务保证 resolve(value) 的时候，把值传给then的回调，可以接收到
    // 改变状态在宏任务中改变
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = FULFILLRD;
        self.value = value;
        self.resolvedCallbacks.forEach((callback) => {
          callback(value);
        });
      }
    }, 0);
  }

  function reject(value) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = REJECTED;
        self.value = value;
        self.rejectedCallbacks.forEach((callback) => {
          callback(value);
        });
      }
    }, 0);
  }

  try {
    fn(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

/**
 * 承前：第一个promise完成后，调用其resolve变更状态，resolve中会依次调用callback里的回调，这样就执行了 then里方法
 * 启后：第一个promise完成后，其then执行完，返回一个结果，结果是简单值，调用新的promise的resolve，变更状态，
 *      这次又会依次调用新promise的callbacks，循环上面过程。
 *      如果返回结果是一个promise，则需要走promise的then把callback存起来。
 *      等他完成之后再触发新promise的resolve，所以promise.then
 * then返回Promise，pending将回调存起来，否则执行
 * @param {*} onFulfilled
 * @param {*} onRejected
 * @returns
 */
MyPromise.prototype.then = function (onFulfilled, onRejected) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  return new MyPromise((resolve, reject) => {
    let fulfilled = () => {
      try {
        const result = onFulfilled(self.value);
        return result instanceof MyPromise
          ? result.then(resolve, reject)
          : resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    let rejected = () => {
      try {
        const result = onRejected(self.value);
        return result instanceof MyPromise
          ? result.then(resolve, reject)
          : reject(result);
      } catch (error) {
        reject(error);
      }
    };

    switch (self.state) {
      case PENDING:
        self.rejectedCallbacks.push(rejected);
        self.resolvedCallbacks.push(fulfilled);
        break;
      case FULFILLRD:
        fulfilled();
        break;
      case REJECTED:
        rejected();
        break;

      default:
        break;
    }
  });
};

console.log(
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      resolve("b");
      console.log("a");
    }, 0);
  })
    .then((res) => {
      console.log(res);
      return new MyPromise((resolve) => resolve("c"));
    })
    .then((res) => {
      console.log(res);
    })
    .then(
      (res) => {
        return new Promise((reject) => reject(`error ${res}`));
      },
      (err) => {
        // 没有写catch，所以reject中执行
        throw new Error(`error。。。 ${err}`);
      }
    )
  // .then((res) => {
  //   throw Error(`error ${res}`);
  // })
  // .catch((err) => {
  //   console.log(err);
  // })
);

// Promise.resolve(1)
//   .then((res) => {
//     console.log(res);
//     return 2;
//   })
//   .catch((err) => {
//     return 3;
//   })
//   .then((res) => {
//     console.log(res);
//   });

// console.log(
new Promise((resolve) => setTimeout(() => resolve(3), 0))
  .then((res) => {
    console.log(res);
    return Promise.resolve(2);
  })
  .then((res) => {
    console.log(res);
    return new Promise((resolve) => resolve(1));
  })
  // .then((res) => console.log(res))
  .then((res) => {
    throw new Error(`error!!!${res}`);
  })
  .catch((err) => {
    console.log(err, "err...");
  });
// );
