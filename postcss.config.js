// element-ui css 188k
// mdi css 171k

const Purgecss = require("@fullhuman/postcss-purgecss");

const purgecss = Purgecss({
  // Specify the paths to all of the template files in your project
  content: ["./src/**/*.vue"],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  whitelist: ["html", "body"],
  whitelistPatternsChildren: []
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    require("postcss-import"),
    require("postcss-url"),
    require("autoprefixer"),
    require("cssnano")({
      preset: "default"
    }),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : [])
  ]
};
