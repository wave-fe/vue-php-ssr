# vue-php-ssr

vue-php-ssr 是在php后端环境下对vue项目进行首屏渲染的方案

本项目旨在给期望使用vue又对首屏有较高要求的项目多一个ssr方案的选择，毕竟那么多人试过node ssr后都从入门到放弃，运维成本无法接受

php作为老牌语言在运维经验方面具有较多沉淀，又有hhvm加持，性能上远超node ssr

## 如何使用

项目搭建请参考packages/vue-php-demo/任意一个项目

npm i; npm start

## 目标

在与纯前端vue项目存在较少开发区别的情况下实现ssr

## 性能

依页面复杂程度和硬件性能不同，耗时最少可达零点几毫秒，多则10几毫秒（macbook 2.7 GHz Intel Core i5 8 GB 1867 MHz DDR3）

## 特性

目前已支持绝大多数vue特性，以下内容仅是主要功能罗列
支持es6包管理
支持computed属性
支持在template里调用方法
支持vue-router，暂不支持vuex，未来会考虑支持

## 联系我

任何使用意向或问题请联系我~

[提issue](https://github.com/wave-fe/vue-php-ssr/issues/new)

求打赏

![打赏](reward.png)

## 架构

以后细说
