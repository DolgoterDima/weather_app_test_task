const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "production" ? "/weather-app/" : "/",

  lintOnSave: false,
  configureWebpack: {
    publicPath: process.env.NODE_ENV === "production" ? "/weather-app/" : "/",

    plugins: [
      new webpack.DefinePlugin({
        // allow access to process.env from within the vue app
        "process.env": {
          WEATHER_API_KEY: JSON.stringify(process.env.WEATHER_API_KEY),
        },
      }),
    ],
  },
});
