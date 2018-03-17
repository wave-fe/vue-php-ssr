    <template>
        <span>
            <span v-if="l === 1">hello ab{{l}}c</span>
            <span v-else>world ab{{l}}c</span>
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
            }
        };
    </script>
    <style lang="styl" scoped>
        .hello
            font-size: 12px;
    </style>
