    <template>
        <div>
            <span class="hello" v-for="item1 in getList(data)">
                <span class="hello" v-for="item2 in item1">
                    {{this.a.sayHello(item2)}}
                </span>
            </span>
            <span class="a" @click="onclick">{{abc}}</span>
            <span class="b">{{1+2}}</span>
        </div>
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
