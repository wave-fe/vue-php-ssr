    <template functional>
        <div :b="hello" class="oh-class">
            <span class="hello" v-for="item1 in getList()">
                {{this.sayHello(item1)}}
            </span>
            <index2 :a="hello"/>
            <p/>
        </div>
    </template>
    <script>
        import index2 from './index2';

        export default {
            components: {
                index2
            },
            data: function () {
                return {
                    a: 1,
                    list: [1, 2, 3, 4]
                };
            },
            computed: {
                hello() {
                    return 'hello world';
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
