// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Class_App from './App'

export function render(data) {
    /* eslint-disable no-new */
    let instance = new Vue({
      ssrEntry: Class_App,
    });
    return instance.render(data);
}
