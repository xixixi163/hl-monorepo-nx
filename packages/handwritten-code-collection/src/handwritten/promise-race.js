const PENDING = "pending";
const FULFILLRD = "fulfillde";
const REJECTED = "rejected";

function MyPromise(fn) {
  var self = this;
  this.value = null;
  this.state = PENDING;
  this.resolveCallbacks = [];
  this.rejectCallbacks = [];

  function resolve(value) {
    if (value instanceof MyPromise) {
      return value.then(resolve, reject);
    }

    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = FULFILLRD;
        self.value = value;
        self.resolveCallbacks.forEach((callback) => {
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
        self.rejectCallbacks.forEach((callback) => {
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

MyPromise.prototype.then = function (onFulfilled, onRejected) {
  const self = this;
  return new MyPromise((resolve, reject) => {
    const fulfilled = function () {
      try {
        let result = onFulfilled(self.value);
        return result instanceof MyPromise
          ? result.then(resolve, reject)
          : resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    let rejected = function () {
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
        self.resolveCallbacks.push(fulfilled);
        self.rejectedCallbacks.push(rejected);
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

/**
 * promise All
 * 嵌套promise，使用resolve拿到每个结果
 * reject 时不完善
 * @param {*} promises
 * @returns mypromise
 */
function promiseAll(promises) {
  return new MyPromise(function (resolve, reject) {
    if (!Array.isArray(promises)) {
      throw new TypeError(`argument must be a array`);
    }
    let resolvedCounter = 0;
    const promiseNum = promises.length;
    const resolvedResult = [];
    for (let i = 0; i < promiseNum; i++) {
      new MyPromise((resolve, reject) => {
        // 子promise包裹，promise[i]作为值传入子then，子then的fn被存起来，子resolve去执行fn，
        // 子then的fn中又使用了外层resolve去执行promiseAll，当promiseAll调用then时，会把then存起来，微任务再执行这个resolve，以执行我们写的then
        setTimeout(() => {
          resolve(promises[i]);
        }, 0);
      }).then(
        (value) => {
          resolvedCounter++;
          resolvedResult[i] = value;
          if (resolvedCounter === promiseNum) {
            return resolve(resolvedResult);
          }
        },
        (error) => {
          return reject(error);
        }
      );
    }
  });
}

/**
 * 返回一个完成的异步任务，不管是reject 还是resolve
 * promise resolve 后，会改变state，只有pending才会执行callback
 * 每个promise都执行了then的callback，但是子then传入的是父的resolve，所以父的resolve只会执行一次后，其他的不执行了
 */
function promiseRace(promises) {
  return new MyPromise((resove, reject) => {
    if (!Array.isArray(promises)) {
      throw new TypeError(`argument must be a array`);
    }
    for (let i = 0; i < promises.length; i++) {
      console.log("enter for...");
      promises[i].then(resove, reject);
    }
  });
}

let p1 = new MyPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(1);
  }, 0);
});

let p2 = new MyPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(2);
  }, 0);
});

let p3 = new MyPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(3);
  }, 0);
});
promiseRace([p1, p2, p3]).then((res) => console.log(res));

let pp1 = Promise.reject(2);
let pp2 = new Promise((resolve, reject) => {
  resolve("a");
});
let pp3 = new Promise((resolve) => {
  setTimeout(() => {
    resolve("foo");
  }, 0);
});

Promise.race([pp1, pp3, pp2])
  .then((res) => console.log(res))
  .catch((err) => console.log(err));
