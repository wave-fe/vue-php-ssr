let priorities = [
    // 留一个占位，优先级从1开始
    ['placeholder'],
    ['='],
    ['?:'],// 三元表达式
    ['||'],
    ['&&'],
    ['|'],
    ['^'],
    ['&'],
    ['==', '!=', '===', '!=='],
    ['>', '<', '>=', '<='],
    ['>>', '<<', '>>>'],
    ['+', '-'],
    ['*', '/', '%'],
    ['-', '~', '!', 'delete', 'new', 'typeof', 'void'],
    ['.', '[]', '()']
];

module.exports = {
    //
    // classize:
    //
    // Example
    //   input: 'some.module.name'
    //   output: '\Some\Module\Name'
    //
    classize: function (string) {
        var modules = string.split(".");
        if (modules.length == 1) {
            // return string.charAt(0).toUpperCase() + string.slice(1);
            return string;
        } else {
            var m = [];
            for (var i=0; i<modules.length; i++) {
                m.push(this.classize(modules[i]));
            }
            return m.join("\\");
        }
    },

    clone: function(obj) {
        var parent = null, response = null;

        // prevent circular loop when cloning the obj.
        if (obj.parent) {
            parent = obj.parent;
            delete obj.parent;
        }

        response = JSON.parse(JSON.stringify(obj));

        // keep original parent
        if (parent) { obj.parent = parent; }

        return response;
    },

    isString: function(node) {
        return node.type == "Literal" && node.raw.match(/^['|"]/);
    },

    isRegExp: function(node) {
        var value = node.raw;

        if (value.match(/^['"].+['"]$/)) {
            value = value.substr(1, node.raw.length-2);
        }

        var isRegExp = value.match(/^\/[^\/]+\/[gimy]?$/);

        if (isRegExp) {
            node.raw.value = "'" + value + "'";
            node.dataType = 'RegExp';
        }

        return isRegExp;
    },
    comparePriority: function (a = '', b = '') {
        function getPriority (operator) {
            if (!operator) {
                return Infinity;
            }
            return priorities.findIndex(priority => priority.find(p => p === operator)) || Infinity;
        }
        return getPriority(a) > getPriority(b);
    },
    isConst: function(name) {
        if (!name) {
            return false;
        }
        if (name.toLocaleUpperCase() === name) {
            return true;
        }
        return false;
    },
    isArgument: function (node) {
        let parent = node.parent;
        if (/Function/.test(parent.type)) {
            return parent.params.some(arg => arg === node);
            
        }
        else {
            return false;
        }
    },
    isClassProperty: function (node) {
        let parent = node.parent;
        if (parent.type === 'ClassBody') {
            return parent.body.some(arg => arg === node);
            
        }
        else {
            return false;
        }
    }
};
