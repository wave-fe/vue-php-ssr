// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Class_App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
      App: Class_App
  },
  template: '<App/>'
});
