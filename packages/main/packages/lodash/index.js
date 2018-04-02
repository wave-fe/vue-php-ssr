export default function () {
};

export function chunk(arr, count) {
};

export function find(arr, iterator) {
    for (var data of arr) {
        if (iterator(data)) {
            return data;
        }
    }
};
