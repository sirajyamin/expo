const imageBabel = require("@unitools/babel-plugin-universal-image");
const path = require("path");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      [
        "module-resolver",
        {
          alias: {},
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
