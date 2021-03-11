import Vue from "vue";

function register(componentContext, Vue) {
  componentContext.keys().forEach(item => {
    const componentConfig = componentContext(item);
    const component = componentConfig.default || componentConfig;
    Vue.component(component.name, component);
  });
}
const componentDir = require.context("@/components", false, /\.vue$/);

register(componentDir, Vue);
