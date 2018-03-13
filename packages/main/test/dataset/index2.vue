    <template>
        <span v-for="l in list">
            ab{{l}}c
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
