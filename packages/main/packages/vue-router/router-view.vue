<template>
    <component :is="type" :data="data"/>
</template>

<script>
export default {
    data() {
        // var_dump(this.router);
        let requestURI = '';
        if ('REQUEST_URI' in _SERVER) {
            requestURI = _SERVER["REQUEST_URI"];
        }
        let info = this.router.matchRoute(requestURI);
        let type = '';
        let data = [];
        if (info) {
            type = info['component'];
            data = info['data'];
        }
        return {
            type,
            data
        }
    }
}
</script>

<style>
</style>
