<template>
    <component :is="type"/>
</template>

<script>
export default {
    data() {
        // var_dump(this.router);
        let requestURI = '';
        if ('REQUEST_URI' in _SERVER) {
            requestURI = _SERVER["REQUEST_URI"];
        }
        let info = this.$route.matchRoute(requestURI);
        // for test
        // let info = this.$route.matchRoute('/');
        let type = '';
        let param = [];
        if (info) {
            type = info['component'];
            this.$route.params = info['data'];
        }
        return {
            passThroughData: true,
            type
        }
    }
}
</script>

<style>
</style>
