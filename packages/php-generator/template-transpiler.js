let estraverse = require('estraverse');
let escope = require('escope');
let estemplate = require('estemplate');
let {isClosureVariable} = require('./utils');
module.exports = function (ast) {
    // 去掉with
    estraverse.replace(ast, {
        enter: function (node, parent) {
            if (node.type == 'WithStatement') {
                return node.body;

            }
        }
    });
    // 分析scope
    let scopeManager = escope.analyze(ast);
    let currentScope = scopeManager.acquire(ast);

    // 为函数调用和变量增加this，闭包不增加
    estraverse.replace(ast, {
        enter: function (node, parent) {
            // 处理所有的Identifier，也就是变量名
            // 判断是否是闭包变量，不是闭包的就需要添加this指针
            // a.b在traverse到b的时候是identity，但是不应该加this
            // 可以通过parent是否是MemberExpression来判断当前节点是否是在读取属性
            if (
                node.type === 'Identifier'
                && parent.type !== 'MemberExpression'
            ) {
                if (!isClosureVariable(node, currentScope)) {
                //     console.log('>>>', node.name, '<<<', ' is closure variable');
                // }
                // else {
                //     console.log('>>>', node.name, '<<<', ' is not closure variable');
                    this.skip();
                    // console.log('>>>', node.type, '<<<', node);
                    // console.log('>>>parent<<<', parent);
                    return {
                        "type": "MemberExpression",
                        "computed": false,
                        "object": {
                            "type": "ThisExpression"
                        },
                        "property": node
                    };
                }
            }
            // 进入新的scope
            currentScope = scopeManager.acquire(node) || currentScope;
        },
        leave: function(node) {
            currentScope = scopeManager.release(node) || currentScope;

            // do stuff
        }
    });
};
