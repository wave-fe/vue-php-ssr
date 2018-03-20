    <template>
        <span>
            <p>{{a}}</p>
            <span v-if="lol === 1">true, hello ab{{sayHello()}}c</span>
            <span v-else>false, world ab{{lol}}c</span>
        </span>
    </template>
    <script>
        export default {
            props: ['a'],
            data: function () {
                return {
                    list: [1, 2, 3, 4],
                    lol: 'lol'
                };
            },
            methods: {
                sayHello() {
                    return 'say~hello~';
                }
            }
        };
    </script>
    <style lang="styl" scoped>
        .hello
            font-size: 12px;
    </style>
