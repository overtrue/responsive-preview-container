const mix = require("laravel-mix");
const tailwindcss = require("tailwindcss");

mix.js("src/index.js", "dist/");
mix.js("src/app.js", "dist/");
mix.options({
  processCssUrls: false,
  postCss: [tailwindcss("./tailwind.config.js")]
});

mix.webpackConfig({
  output: {
    libraryTarget: "umd"
  }
});
