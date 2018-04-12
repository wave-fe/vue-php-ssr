    <template>
        <span>
            <p>{{a}}</p>
            <span v-if="lol === 1">true, hello ab{{sayHello()}}c</span>
            <span v-else>false, world ab{{lol}}c</span>
        </span>
    </template>
    <script>
        export default {
            // props: ['a', 'lol'],
            props: {
                a: {
                    default: 1
                },
                lol: {
                    default: 1
                }
            },
            data: function () {
                return {
                    list: [1, 2, 3, 4],
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
