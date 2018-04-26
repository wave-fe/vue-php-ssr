export function add(a, b) {
    if (is_numeric(a) && is_numeric(b)) {
        return a += b;
    }
    return `${a}${b}`;
}

class Arr extends ArrayAccess {

    constructor(init = array()) {
        this.priv_data = init;
    }

    __get(prop) {
        return this.priv_data[prop];
    }

    __set(prop, val) {
        this.priv_data[prop] = val;
        return val;
    }

    offsetExists(offset) {
        return isset(this.priv_data[offset]);
    }

    offsetGet(offset) {
        return this.priv_data[offset];
    }

    offsetSet(offset, value) {
        this.priv_data[offset] = value;
    }

    offsetUnset(offset) {
        unset(this.priv_data[offset]);
    }

    __invoke() {
        return this.priv_data;
    }


}

export function arr($arr) {
    return new Arr($arr);
}
