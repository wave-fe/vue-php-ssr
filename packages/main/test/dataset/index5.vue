    <template>
        <span v-if="a.b.c.config.length || promote || banner.type">
            {{banner.type}}
        </span>
    </template>
    <script>
        let a = {
            methods: {
                computed() {
                }
            },
            computed: {
                methods() {
                }
            }
        };
        export default a;
        // export default {};
    </script>
    <style lang="styl" scoped>
        .hello
            font-size: 12px;
    </style>
