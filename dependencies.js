"use strict";

const d = (v, d) => (v != null ? v : d);

module.exports = function(api, opts = {}) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvTest = env === "test";

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
      isEnvTest && require("babel-plugin-transform-dynamic-import").default
    ].filter(Boolean)
  };
};
