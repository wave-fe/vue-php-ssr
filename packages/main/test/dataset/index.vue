    <template>
        <div>
            <span class="hello" v-for="item1 in getList()">
                {{this.sayHello(item1)}}
            </span>
            <test/>
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
