var utils = require('../utils');

module.exports = {
    test: function (node) {
        let regExpStr = node.object.raw;
        if (!/^\//.test(regExpStr)) {
            // 判断是否是正则表达式
            // 不是的就不处理，直接返回node
            return node;
        }
        // /regex/g.test('xxx');
        // 获取'xxx'
        let args = utils.clone(node.parent.arguments);
        // node.parent.callee.object是/regex/
        args.unshift(node.parent.callee.object);

        let regex = regExpStr.replace(/\w+$/, '');
        let flags = regExpStr.match(/\w+$/);
        flags = flags ? flags[0] : '';
        let isGroup = flags.indexOf('g') >= 0;

        // remove unsupported /g from regexp, to use preg_match_all
        if (isGroup) { flags = flags.replace("g", ""); }
        regex = regex + flags;

        args[0].raw = "'" + regex + "'";
        args[0].type = "Literal";

        node.parent.arguments = false;

        return {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: (isGroup) ? 'preg_match_all' : 'preg_match',
          },
          arguments: args
        };
    },
    exec: function (node) {
        let regExpStr = node.object.raw;
        if (!/^\//.test(regExpStr)) {
            // 判断是否是正则表达式
            // 不是的就不处理，直接返回node
            return node;
        }
        // /regex/g.test('xxx');
        // 获取'xxx'
        let args = utils.clone(node.parent.arguments);
        // node.parent.callee.object是/regex/
        args.unshift(node.parent.callee.object);

        let regex = regExpStr.replace(/\w+$/, '');
        let flags = regExpStr.match(/\w+$/);
        flags = flags ? flags[0] : '';
        let isGroup = flags.indexOf('g') >= 0;

        // remove unsupported /g from regexp, to use preg_match_all
        if (isGroup) { flags = flags.replace("g", ""); }
        regex = regex + flags;

        args[0].raw = "'" + regex + "'";
        args[0].type = "Literal";

        node.parent.arguments = false;

        return {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            // exec只能匹配一次，就选用preg_match
            name: 'preg_match',
          },
          arguments: args
        };
    }
}
