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

        var handler = _array[method] || _date[method] || _function[method] || _json[method] || _string[method] || _math[method] || _number[method] || _regexp[method] || _object[method];

        return (handler) ? handler(node) : node;
    }

}
