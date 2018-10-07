"use strict";

const path = require("path");
const d = (v, d) => (v != null ? v : d);

module.exports = function(api, opts = {}) {
  const env = api.env();
  const isEnvTest = env === "test";
  const transformRuntime = d(opts.transformRuntime, {
    corejs: false,
    helpers: true,
    regenerator: true,
    useESModules: !isEnvTest,
    absoluteRuntime: path.dirname(
      require.resolve("@babel/runtime/package.json")
    )
  });

  return {
    sourceType: "unambiguous",
    presets: [
      [
        require("@babel/preset-env").default,
        {
          debug: opts.debug,
          useBuiltIns: false,
          modules: d(opts.modules, isEnvTest ? "commonjs" : false),
          ignoreBrowserslistConfig: true,
          exclude: d(opts.exclude, ["transform-typeof-symbol"]),
          targets: d(
            opts.targets,
            isEnvTest
              ? {
                  node: "current"
                }
              : {
                  ie: 10
                }
          )
        }
      ]
    ],
    plugins: [
      require("@babel/plugin-syntax-dynamic-import").default,
      isEnvTest && require("babel-plugin-transform-dynamic-import").default,
      transformRuntime && [
        require("@babel/plugin-transform-runtime").default,
        transformRuntime
      ]
    ].filter(Boolean)
  };
};
