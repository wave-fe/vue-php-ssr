var utils = require('./utils'),
    _array = require('./core/array'),
    _date = require('./core/date'),
    _function = require('./core/function'),
    _json = require('./core/json'),
    _string = require('./core/string'),
    _regexp = require('./core/regexp'),
    _object = require('./core/object'),
    _math = require('./core/math'),
    _number = require('./core/number');
    _console = require('./core/console');

function getHandle(method, namespace) {
    let modules = [_array, _date, _function, _json, _string, _math, _number, _regexp, _object, _console];
    let key = namespace + method;
    let handler = modules.find(module => module[key]);
    if (handler) {
        return handler[key];
    }
    else {
        handler = modules.find(module => module[method]);
        if (handler) {
            return handler[method];
        }
    }
}

module.exports = {

    evaluate: function(node) {
        var method = node.property.name;
        // 防止hasOwnProperty这样的方法返回native的hasOwnProperty，
        // 而不是需要处理hasOwnProperty的方法
        let testObj = {};
        if (method in testObj) {
            method = '_' + method;
        }

        // if (method == "hasOwnProperty") {
        //   var args = utils.clone(node.parent.arguments);
        //   node.parent.arguments = false;
        //   return { type: 'CallExpression', callee: { type: 'Identifier', name: 'isset', }, arguments: args };
        // }
        let handler = getHandle(method, node.object.name);

        if (handler) {
            return handler(node);
            // if (
            //     // 大写的都是常量
            //     /^[A-Z]/.test(method)
            //     // 或者原始代码就是方法执行
            //     || node.parent.type === 'CallExpression'
            // ) {
            //     return handler(node);
            // }
            // else {
            //     // 其他的就是原始代码不是执行，但是名字撞上了
            //     return node;
            // }
        }
        else {
            return node;
        }
    }

}
