import Vue from "vue";
import Vuex from "vuex";

// import dashboard from './modules/dashboard'

Vue.use(Vuex);

/**
 * 读取./modules下的所有js文件并注册模块 //前端自动化引入文件
 */
const requireModule = require.context("./modules", false, /\.js$/);
const modules = {};

requireModule.keys().forEach(fileName => {
  const moduleName = fileName.replace(/(\.\/|\.js)/g, "");
  modules[moduleName] = {
    namespaced: true,
    ...requireModule(fileName).default
  };
});

export default new Vuex.Store({
  modules
});
