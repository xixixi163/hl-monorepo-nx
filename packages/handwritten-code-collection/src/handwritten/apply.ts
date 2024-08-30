interface Function {
    myApply(context: any, args: any[]): any
}
Function.prototype.myApply = function(context) {
    // 判断调用myApply的this，也就是这个调用是不是方法调用的
    if(typeof this !== 'function') {
        return new TypeError('error')
    }
    // 取参数
    // const args = Array.prototype.slice.call(arguments, 1)

    context = context || window

    context.fn = this
    let result = null
    console.log(arguments[1])
    result = context.fn(...arguments[1])
    delete context.fn
    return result
}

let obj1 = {
    name: 'John',
    school: 'high school'
}

function great(this: any, num: string, state: string) {
    console.log(`${this.name},${this.school}, ${num},${state}`)
}

great.myApply(obj1, [66, 'nice'])