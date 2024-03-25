/**
 * 防抖
 * 事件在触发n秒后再执行回调，n秒内又被触发，则重新计时。
 * 避免用户多次点击向后端发送多次请求
 * @param {*} fn
 * @param {*} wait
 * @returns fn
 */
function debounce(fn, wait) {
  let timer = null;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let context = this,
      args = arguments;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
}

const testFn = () => {
  console.log("111");
};

// 只会输出一次结果
const a = debounce(testFn, 1000);
a();
a();
