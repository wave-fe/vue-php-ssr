<template>
    <a :href="addr"><slot></slot></a>
</template>

<script>
export default {
    props: ['to'],
    data() {
        return {
            type: ''
        }
    },
    computed: {
        addr() {
            if (typeof this.to === 'array') {
                let str = '/' + this.to['name'];
                if ('params' in this.to) {
                    let params = this.to['params'];
                    str = str + '?';
                    for (var key in params) {
                        str = str + key + '=' + params[key];
                    }
                }
                return str;
            }
            else {
                return this.to;
            }
        }
    }
}
</script>

<style>
</style>
