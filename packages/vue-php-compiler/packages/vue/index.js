import {hyphenate as func_hyphenate} from './util';
export default class Vue {
    constructor(data=[], children=[]) {
        if (!isset(self.staticComponents)) {
            self.staticComponents = {};
        }
        if (!isset(self.plugins)) {
            self.plugins = {};
        }
        // 处理props
        if (isset(this.props)) {
            for (var key in this.props) {
                let prop = this.props[key];
                if (array_key_exists('default', prop)) {
                    this[key] = prop['default'];
                }
                else {
                    this[key] = null;
                }
            }
        }
        this._slot = {
            default: function (props=[]) {
                return children;
            } 
        };
        // if ('scopedSlots' in data) {
        //     this.$scopedSlots = data['scopedSlots'] || [];
        // }
        if ('attrs' in data) {
            this.setProps(data['attrs']);
        }

        if ('_route' in data) {
            this.$route = data['$route'];
        }

        if ('router' in data) {
            this.$route = data['router'];
        }

        if ('components' in data) {
            this.components = data['components'];
        }
        if ('_parentData' in data) {
            this._parentData = data['_parentData'];
        }

        // 处理data
        let d = this.data();
        for (var key in d) {
            this[key] = d[key];
        }
        this.childrenInstance = [this];

        // new Vue()时参数的处理
        if ('ssrEntry' in data) {
            this.ssrEntry = data['ssrEntry'];
        }

    }

    static use(Comp) {
    }

    static component(name, comp) {
        self.staticComponents[name] = comp;
    }

    data() {
        return {};
    }

    _e() {
        return '';
    }

    _t(name, fallback=[], props=[], bindObject=[]) {
        if (name in this._slot) {
            let slotFn = this._slot[name];
            let result = slotFn(props);
            if (result) {
                return result;
            }
            else {
                return fallback;
            }
        }
        return '';
    }

    // text node
    _v(content) {
        return this._s(content);
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

    _getComp(tag) {
        if (/^\\\\/.test(tag)) {
            // 如果已经是一个类的namespace则直接返回
            return tag;
        }
        tag = tag.replace(/-/g, '').toLowerCase();
        if (isset(this.components) && array_key_exists(tag, this.components)) {
            return this.components[tag];
        }
        else if (array_key_exists(tag, self.staticComponents)) {
            return self.staticComponents[tag];
        }
        return null;
    }

    _c(tag, data = [], children = [], normalizationType = 0, alwaysNormalize = false) {
        // 这段抄的vue/src/core/vdom/create-element.js#createElement
        if (this.isPlainArray(data) || this.isPrimitive(data)) {
            normalizationType = children;
            children = data;
            data = [];
        }

        if (alwaysNormalize) {
            normalizationType = 2;
        }
        // 抄到这，下面是自己写的了

        // 子组件
        let comp = this._getComp(tag);
        if (comp) {
            // print('>>><<<');
            //     var_dump(data);
            // if (tag === 'component') {
            // }
            if (property_exists(this, '_route')) {
                data['$route'] = this.$route;
            }
            if (property_exists(this, '_parentData')) {
                data['_parentData'] = this._parentData;
            }
            let instance = new comp(data, children);

            if ('model' in data) {
                this.value = data['model']['value'];
            }

            return function () {
                instance.$parent = this.childrenInstance[0];
                this.childrenInstance.unshift(instance);
                let html = '';
                if (property_exists(this, 'passThroughData')) {

                    html = instance.render(this._parentData);
                }
                else {
                    html = instance.render();
                }
                this.childrenInstance.shift();
                return html;
            };
        }
        else {
            if (is_array(children)) {
                arr = children
            }
            else {
                arr = [children];
            }
            let attrs = [];
            // 处理attrs
            if ('attrs' in data) {
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
            arr.unshift(`<${tag}${attrStr}>`);
            arr.push(`</${tag}>`);
            return arr;
        }
    }

    setAttrs() {
    }

    _ssrNode(open, close="", children=[], normalizationType=1) {
        children.unshift(open);
        children.push(close);
        return children;
    }

    _l(content, cb) {
        let arr = [];
        for (var i = 0; i < content.length; i++) {
            arr.push(cb(content[i], i));
        }
        return arr;
    }

    _ssrList(content, cb) {
        return this._jump(this._l(content, cb));
    }

    _ssrEscape(content) {
        return content
            .replace('"', '&quot;')
            .replace('\'', '&#39;')
            .replace('\&', '&amp;')
            .replace('<', '&lt;')
            .replace('>', '&gt;');
    }

    _ssrAttr(key='', value='') {
        return ' ' + key + '="' + this._s(value) + '"';
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

    _ssrStyle(staticStyle={}, dynamic={}, extra={}) {
        let style = {};
        if (staticStyle) {
            style = array_merge(style, staticStyle);
        }
        if (dynamic) {
            style = array_merge(style, dynamic);
        }
        if (extra) {
            style = array_merge(style, extra);
        }
        let styleText = '';
        for (var key in style) {
            let value = style[key];
            let hyphenatedKey = func_hyphenate(key);
            if (is_array(value)) {
                for (var i = 0; i < value.length; i++) {
                    styleText = styleText + `${hyphenatedKey}:${value[i]};`;
                }
            }
            else {
                styleText = styleText + `${hyphenatedKey}:${value};`;
            }
        }
        if (styleText) {
            styleText = ' style=' + JSON.stringify(this._s(styleText));
        }
        return styleText;
    }

    _jump(d) {
        if (typeof d === 'object') {
            return this._jump(d());
        }
        if (typeof d === 'array') {
            let html = '';
            for (var i = 0; i < d.length; i++) {
                html = html + this._jump(d[i]);
            }
            return html;
        }
        else {
            return d;
        }
    }

    /**
     * 子类会override这个方法，只有new Vue() 会调用这个方法
     */
    _render(_ssrRenderData=[]) {
        let entry = this.ssrEntry;
        let constructorData = {};
        if (property_exists(this, '_route')) {
            constructorData['$route'] = this.$route;
        }
        constructorData['_parentData'] = _ssrRenderData;
        let instance = new entry(constructorData);
        return instance.render(_ssrRenderData);
    }

    render(data = {}) {
        for (key in data) {
            this[key] = data[key];
        }
        return this._jump(this._render(data));
    }
}
