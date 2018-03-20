export class base {
    constructor() {
        let method = 'data';
        let data = this.data();
        for (key in data) {
            this[key] = data[key];
        }
    }

    data() {
        return {};
    }

    _s(content) {
        return content;
    }

    _c(tag, children = []) {
        // 子组件
        if (array_key_exists(tag, this.components)) {
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
