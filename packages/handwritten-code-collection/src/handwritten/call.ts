interface Function {
    myCall(context: any, ...arg: number[]): any
}

Function.prototype.myCall = function(context: any) {
    // 判断this是不是function,这时候的this是调用mycall的函数
    if (typeof this !== 'function') {
        return new Error('type error')
    }
    // 拿出参数,第一个参数是绑定的obj，后面的才是传入的参数列表
    const args = Array.prototype.slice.call(arguments,1);
    let result = null;
    // 非严格模式，没有传上下文this对象，为window
    context = context || window
    // 相当于把great 挂在obj上
    context.fn = this;

    console.log(args)
    // obj调用great，this指向调用这个方法的最后一个对象
    result = context.fn(...args)

    delete context.fn
    return result;
}

const obj = {
    name: 'John',
    talk: 'it‘s a beautiful world'
}

function great(this: any, age: number, num: number) {
    console.log(`${(this as any).name} say ${this.talk} (${age}),${num}`)
}

great.myCall(obj, 10, 20)