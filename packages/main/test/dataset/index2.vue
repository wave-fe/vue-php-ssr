    <template>
        <span>
            <span v-if="lol === 1">hello ab{{sayHello}}c</span>
            <span v-else>world ab{{lol}}c</span>
        </span>
    </template>
    <script>
        export default {
            data: function () {
                return {
                    a: 1,
                    list: [1, 2, 3, 4],
                    lol: 'hello'
                };
            },
            method: {
                sayHello() {
                }
            }
        };
    </script>
    <style lang="styl" scoped>
        .hello
            font-size: 12px;
    </style>
