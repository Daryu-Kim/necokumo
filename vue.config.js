const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: "src/main.js",
      title: "네코쿠모 - 프리미엄 전자담배 쇼핑몰",
    },
  },
  pwa: {
    name: "네코쿠모",
    themeColor: "#ffffff",
    backgroundColor: "#ffffff",
    display: "standalone",
    start_url: "/",
  },
});
