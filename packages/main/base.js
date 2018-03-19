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
        return content;
    }

    render() {
        return this._render();
    }
}
