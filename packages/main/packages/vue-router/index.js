import Class_RouterView from './router-view';
import Class_RouterLink from './router-link';
import Vue from 'vue';

export default class VueRouter {

    constructor(config) {
        this.config = config;
        this.addRoute();
    }

    addRoute() {
        let routes = this.config['routes'];
        for (var i = 0; i < routes.length; i++) {
            let item = routes[i];
            // 处理/xx/:xx这种模式
            // 使用正则分组来获取匹配路径
            let regStr = item['path'].replace(/:(\w+)/g, '(?<$1>\w+)').replace('/', '\\/');
            // 这里直接用item['regPath']不行，php好像是拷贝赋值，不是引用
            this.config['routes'][i]['regPath'] = '/' + regStr + '/';
        }
    }

    matchRoute(uri) {
        let routes = this.config['routes'];
        for (var i = 0; i < routes.length; i++) {
            let currentRoute = routes[i];
            let regStr = currentRoute['regPath'];
            if(preg_match(regStr, uri, matches)) {
                return {
                    component: currentRoute['component'],
                    name: currentRoute['name'],
                    data: matches
                }
            } 
        }
    }
};

Vue.component('routerview', Class_RouterView);
Vue.component('routerlink', Class_RouterLink);
