const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/swipe-list/",
  devServer: {
    open: "Google Chrome",
  },
});
