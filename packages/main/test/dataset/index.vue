    <template functional>
        <div :async="true">
            <span class="static-class" :class="hello" v-for="item1 in getList()">
                {{sayHello(item1)}}
                test!{{hello}}!test
                escape test {{esc}}
            </span>
            <index2 :a="hello" :lol="1"/>
            <index2 v-if="hello" a="hello"/>
        </div>
    </template>
    <script>
        import index2 from './index2';

        export default {
            components: {
                index2
            },
            // props: ['a', 'b', 'c'],
            props: {
                a: {
                    type: String,
                    default: 'a'
                },
                b: {
                    type: String
                }
            },
            data: function () {
                return {
                    a: 1,
                    esc: '<hello></hello>',
                    list: [1, 2, 3, 4]
                };
            },
            computed: {
                hello() {
                    return 'hello ' + this.world;
                },
                world() {
                    return 'world'
                }
            },
            methods: {
                getList() {
                    return [1,2,3,4];
                },
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
