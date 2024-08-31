interface Function {
    myBind(context: any, ...args: any[]): any
}

Function.prototype.myBind = function(context) {
    if (typeof this !== 'function') {
        return new TypeError('error')
    }
    let args = Array.prototype.slice.call(arguments, 1), fn = this

    return function Fn(this: any) {
        // fn 是Fn的实例，说明使用了new 操作符，bind绑定的this会失效。参数传入的是数组
        return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments))
    }
}

let obj2 = {
    name: 'John',
    state: 'nice'
}

function log(this: any, ...args: any[]) {
    console.log(this.name, this.state, ...arguments)
}

/**
 * 调用顺序
 * boundLog2(5,6) return bindLog(3,4,5,6) this='new value'
 * bindLog(3,4,5,6) return log(1,2,3,4,5,6) this=obj2
 * log(1,2,3,4,5,6)
 */
const boundLog = log.myBind(obj2, 1, 2) // 返回新函数boundLog，args: [1,2],this:obj2
const boundLog2 = boundLog.myBind('new value', 3,4)
boundLog2(5,6)

const bindLog = log.bind(obj2, 1, 2)
const binddLog2 = bindLog.bind('new value', 3,4)
binddLog2(5,6)

/**
 * new 操作符会使bind绑定的this失效，this转移到新函数上，但是参数还是可以concat
 */
const newLog = log.bind(obj2, 1, 2)
const newLog2 = new newLog(3,4)
console.log(newLog2)

const newBoundLog = log.bind(obj2, 1,2)
const newBoundLog2 = new newBoundLog(3,4)
console.log(newBoundLog2)
