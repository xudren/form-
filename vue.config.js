const path = require("path");
const resolve = dir => {
  return path.join(__dirname, dir);
};
const prodEnv = process.env.NODE_ENV === "production";
const BASE_URL = prodEnv ? "./" : "/";
module.export = {
  publicPath: BASE_URL,
  lintOnSave: true,
  // webpack相关
  chainWebpack: config => {
    /* 配置别名 */
    config.resolve.alias.set("@", resolve("src"));
  }
};
