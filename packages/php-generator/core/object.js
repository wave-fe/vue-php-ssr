var utils = require('../utils');

module.exports = {
    _hasOwnProperty: function (node) {
        var args = utils.clone(node.parent.arguments);
        node.parent.arguments = false;
        return {
            type: 'CallExpression',
            callee: {
                type: 'Identifier',
                name: 'isset'
            },
            arguments: args
        };
    }

}
