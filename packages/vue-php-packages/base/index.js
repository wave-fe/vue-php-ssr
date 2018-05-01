export function add(a, b) {
    if (is_numeric(a) && is_numeric(b)) {
        return a += b;
    }
    return `${a}${b}`;
}

export function /*ref*/getArr(/*ref*/arg) {
    if (typeof arg === 'array') {
        return arg;
    }
    else if (method_exists(arg, 'toArray')) {
        return arg.toArray();
    }
    else {
        return arg;
    }
}

class Arr extends ArrayAccess {

    constructor(init = array()) {
        this.priv_data = init;
    }

    __get(prop) {
        if (array_key_exists(prop, this.priv_data)) {
            return arr(this.priv_data[prop]);
        }
    }

    __set(prop, val) {
        this.priv_data[prop] = val;
        return val;
    }

    offsetExists(offset) {
        return isset(this.priv_data[offset]);
    }

    offsetGet(offset) {
        return arr(this.priv_data[offset]);
    }

    offsetSet(offset, value) {
        this.priv_data[offset] = value;
    }

    offsetUnset(offset) {
        unset(this.priv_data[offset]);
    }


    /*ref*/toArray() {
        return this.priv_data;
    }


}

export function arr(arg) {
    if (typeof arg === 'array') {
        return new Arr(arg);
    }
    else {
        return arg;
    }
}

