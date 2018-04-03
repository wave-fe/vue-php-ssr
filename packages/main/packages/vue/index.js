export default class vue {
    constructor(props=[]) {
        var key;
        // 处理props
        if (isset(this.props)) {
            for (key in this.props) {
                let prop = this.props[key];
                if (array_key_exists('default', prop)) {
                    this[key] = prop['default'];
                }
                else {
                    this[key] = null;
                }
            }
        }
        this.setProps(props);
        // 处理data
        let data = this.data();
        for (key in data) {
            this[key] = data[key];
        }
    }

    static use(plugin) {
    }

    data() {
        return {};
    }

    _e() {
        return '';
    }

    _s(content) {
        if (content === true) {
            return 'true';
        }
        else if (content === false) {
            return 'false';
        }
        else if (is_array(content)) {
            return json_encode(content);
        }
        return content;
    }

    setProps(props = []) {
        for (key in props) {
            if (array_key_exists(key, this.props)) {
                // this[key] = this._s(props[key]);
                this[key] = props[key];
            }
        }
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
            let instance = new depClass(data['attrs']);
            return instance.render();
        }
        else {
            let str = '';
            for (var i = 0; i < children.length; i++) {
                str = str + children[i];
            }
            let attrs = [];
            // 处理attrs
            if (isset(data['attrs'])) {
                for (key in data['attrs']) {
                    attrs.push(key + '="' + this._s(data['attrs'][key]) + '"');
                }
            }
            let classArr = [];
            if ('staticClass' in data) {
                classArr.push(data['staticClass']);
            }
            if ('class' in data) {
                for (var key in data['class']) {
                    if (data['class'][key]) {
                        classArr.push(key);
                    }
                }
            }
            if (classArr.length) {
                attrs.push('class="' + classArr.join(' ') + '"');
            }
            let attrStr = '';
            if (attrs.length) {
                attrStr = ' ' + attrs.join(' ');
            }
            return `<${tag}${attrStr}>${str}</${tag}>`;
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
        // var_dump('>>>content<<<');
        // var_dump(content);
        return content;
    }
    
    _ssrAttrs(content) {
        return content;
    }

    _ssrDOMProps(content) {
        return content;
    }

    _ssrClass(staticClass, dynamicClass) {
        let classArr = [];
        if (staticClass) {
            classArr.push(staticClass);
        }
        if (dynamicClass) {
            for (var key in dynamicClass) {
                if (dynamicClass[key]) {
                    classArr.push(key);
                }
            }
        }
        return ' class="' + classArr.join(' ') + '"';
    }

    _ssrStyle(content) {
        return content;
    }

    render(data = {}) {
        for (key in data) {
            this[key] = data[key];
        }
        return this._render();
    }
}
