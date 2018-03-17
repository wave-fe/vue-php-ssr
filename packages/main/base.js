export class base {
    _s(content) {
        return content;
    }

    _c(tag, children = []) {
        let str = '';
        for (var i = 0; i < children.length; i++) {
            str = str + children[i];
        }
        return `<${tag}>${str}</${tag}>`;
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
