let targrt: Record<string, any> = {}

let proxy = new Proxy(targrt, {});
proxy.test = 5;
console.log(targrt.test) // 5 改变了源对象
console.log(proxy.test) // 5 包装后的

for(let key in proxy) {
    console.log(key, proxy[key])
}
// -----------------------------------
// proxy 代理带'_'的属性，现es6已支持私有属性，变量前加‘#’，但还需要polyfills，部分js引擎不支持
let user: Record<string, any> = {
    name: 'John',
    _password: '****',
    checkPassword(value: string) {
        return value === this._password
    }
}

user = new Proxy(user, {
    get(target, prop, receiver) { // 拦截属性访问
        if (typeof prop === 'string' && prop.startsWith('_')) {
            throw new Error('Access denied')
        }
        // const value = typeof prop === 'string' && target[prop]
        // 使用Reflect，把this上下文传递给get捕捉器，参数都转发给对象
        const value = Reflect.get(target, prop, receiver)
        // 为什么这里要判断类型，bind
        // function里访问了限制访问的属性，会走到get的逻辑，那么就会error，所以这里为了function的执行成功
        // 将this绑定到target，拿target的限制访问属性，就不受proxy影响
        // 但是，这样操作不理想，因为可能多个proxy包装这个对象，并且将未包装的对象传递给方法，方法可能将未包装的对象传递到其他地方，会产生不可意料的后果
        // 所以不应这样包装（代理）对象
        return typeof value === 'function' ? value.bind(target) : value
    },
    set(target, prop, val) { // 拦截属性写入
        // 因为symbol类型不能通过prop拿，所以需要判断类型
        if(typeof prop === 'string' && prop.startsWith('_')) {
            throw new Error('Access denied')
        } else {
            // 已经进行拦截，需要加上赋值，否则不会set
            // if(typeof prop === 'string') target[prop] = val
            // return true
            return Reflect.set(target, prop, val)
        }
    },
    deleteProperty(target, prop) { // 拦截属性删除
        if(typeof prop === 'string' && prop.startsWith('_')) {
            throw new Error('Access denied')
        } else {
            // if(typeof prop === 'string') delete target[prop]
            // return true
            return Reflect.deleteProperty(target, prop)
        }
    },
    ownKeys(target) { // 拦截读取属性列表
        return Object.keys(target).filter(prop => !(typeof prop === 'string' && prop.startsWith('_')))
    }
})

try {
    // console.log(user._password)
    console.log(user.checkPassword('12'))
} catch (error) {
    console.log(error)
}

try {
    user._password = 'test'
    // user.name = 'add'
    // console.log(user.name)
} catch (error) {
    console.log(error)
}

try {
    delete user._password
    // delete user.name
    // console.log(user.name)
} catch (error) {
    console.log(error)
}

for(let key in user) {
    console.log(key)
}

// -----------------------------------
/**
 * 带有has 捕捉器的 in range，会拦截in调用
 * prop 传进来的数字会变成字符串，注意类型转换
 */
let range = {
    start: 1,
    end: 10
}

range = new Proxy(range, {
    has(target, prop) {
        return typeof prop === 'string' && Number(prop) >= range.start && Number(prop) <= range.end
    }
})

console.log(5 in range)
console.log(20 in range)

// -----------------------------------
/**
 * 包装函数 apply
 * 将代理包装在函数周围，可以将所有东西都转发到目标对象
 */
function delay(f: Function, ms: number) {
    return new Proxy(f, {
        apply(target, thisArg, args) {
            setTimeout(() => target.apply(thisArg, args), ms)
        }
    })
}

function sayHi(user: string) {
    console.log(`hello ${user}`)
}

// 用proxy包装,会把所有的参数等转发给原对象，不会影响原对象
let sh = delay(sayHi, 2000)

console.log(sayHi.length, sh.length) // 被包装后也可以拿到未包装函数的length，函数的length是参数列表长度

sh('John')

/**
 * 实现set的时候，调用函数
 */
let handlers = Symbol('handlers');

function makeObservable(target: {[key: string|symbol]: any}) {
   /* 你的代码 */
  // 1. 初始化 handler 存储
  target[handlers] = [];

  // 将 handler 函数存储到数组中，以便于之后调用
  target.observe = function(handler: Function) {
    this[handlers].push(handler);
  };

  // 2. 创建一个 proxy 以处理更改
  return new Proxy(target, {
    set(target, property, value, receiver) {
      let success = Reflect.set(target, property, value, receiver); // 将操作转发给对象
      if (success) { // 如果在设置属性时没有出现 error
        // 调用所有 handler
        target[handlers].forEach((handler: Function) => handler(property, value));
      }
      return success;
    }
  });
}

let users: Record<string, any> = {};

users = makeObservable(users);

// 因为这里调用了observer，所以需要在包装函数中定义一个observer，才有东西调用，
// 可以把传入observer的handler存在Symbol作为常量的数组中
users.observe((key: string, value: any) => {
  console.log(`SET ${key}=${value}`);
});

users.name = "John";

