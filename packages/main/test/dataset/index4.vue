    <template>
        <span v-if="a.b.c.config.length || promote || banner.type">
            {{banner.type}}
        </span>
    </template>
    <script>
        export default {
            data: function () {
                return {
                    a: 1,
                    list: [1, 2, 3, 4]
                };
            },
            method: {
                sayHello(item) {
                    return 'hello' + item;
                }
            }
        };
    </script>
    <style lang="styl" scoped>
        .hello
            font-size: 12px;
    </style>
