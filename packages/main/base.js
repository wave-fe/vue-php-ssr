export class base {
    constructor() {
        var key;
        // 处理props
        if (isset(this.props)) {
            for (key in this.props) {
                let props = this.props[key];
                if (array_key_exists(key, props)) {
                    this[key] = props.default;
                }
            }
        }
        // 处理data
        let data = this.data();
        for (key in data) {
            this[key] = data[key];
        }
    }

    data() {
        return {};
    }

    _e() {
        return '';
    }

    _s(content) {
        return content;
    }

    isPrimitive(val) {
        if (is_numeric(val) || is_string(val)) {
            return true;
        }
        return false;
    }

    isPlainArray(arr) {
        if (is_array(arr)) {
            keys = array_keys(arr);
            return keys === array_keys(keys);
        }
        return false;
    }

    _c(tag, data = [], children = [], normalizationType = 0, alwaysNormalize = false) {
        // 这段抄的vue/src/core/vdom/create-element.js#createElement
        if (this.isPlainArray(data) || this.isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = null;
        }

        if (alwaysNormalize) {
            normalizationType = 2;
        }
        // 抄到这，下面是自己写的了

        // 子组件
        if (isset(this.components) && array_key_exists(tag, this.components)) {
            let depClass = this.components[tag];
            let instance = new depClass();
            return instance.render();
        }
        else {
            let str = '';
            for (var i = 0; i < children.length; i++) {
                str = str + children[i];
            }
            return `<${tag}>${str}</${tag}>`;
        }
    }

    setAttrs() {
    }

    _ssrNode(content) {
        return content;
    }

    _l(content, cb) {
        let str = '';
        for (var i = 0; i < content.length; i++) {
            str = str + cb(content[i]);
        }
        return str;
    }

    _ssrList(content, cb) {
        let str = '';
        for (var i = 0; i < content.length; i++) {
            str = str + cb(content[i]);
        }
        return str;
    }

    _ssrEscape(content) {
        return content
            .replace('"', '&quot;')
            .replace('\'', '&#39;')
            .replace('\&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;');
    }

    _ssrAttr(content) {
        return content;
    }
    
    _ssrAttrs(content) {
        return content;
    }

    _ssrDOMProps(content) {
        return content;
    }

    _ssrClass(content) {
        return content;
    }

    _ssrStyle(content) {
        return content;
    }

    render() {
        return this._render();
    }
}
