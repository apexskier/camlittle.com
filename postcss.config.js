module.exports = {
  plugins: {
    "postcss-preset-env": {
      stage: 4,
      features: {
        "nesting-rules": true,
      },
    },
    cssnano: {
      autoprefixer: false,
    },
  },
};
