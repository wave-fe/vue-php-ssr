var utils = require('../utils');

module.exports = {
  consolelog: function(node) {
    var method = "var_dump";
    var args = utils.clone(node.parent.arguments);
    node.parent.arguments = false;

    return {
      type: 'CallExpression',
      callee: {
        type: 'Identifier',
        name: method,
      },
      arguments: args
    };
  }
};
