"use strict";

const path = require("path");
const d = (v, d) => (v != null ? v : d);

module.exports = function preset(api, opts = {}) {
  const env = api.env();
  const isEnvProduction = env === "production";
  const isEnvTest = env === "test";

  const pragma = opts.pragma || "React.createElement";
  const pragmaFrag = opts.pragmaFrag || "React.Fragment";
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
    presets: [
      [
        require("@babel/preset-env").default,
        {
          debug: opts.debug,
          useBuiltIns: false,
          modules: d(opts.modules, isEnvTest ? "commonjs" : false),
          exclude: d(opts.exclude, ["transform-typeof-symbol"]),
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
      ],
      [
        require("@babel/preset-react").default,
        {
          pragma,
          pragmaFrag,
          useBuiltIns: true,
          development: !isEnvProduction
        }
      ]
    ],
    plugins: [
      require("babel-plugin-macros"),
      require("@babel/plugin-transform-destructuring").default,
      [require("@babel/plugin-proposal-decorators").default, { legacy: true }],
      [
        require("@babel/plugin-proposal-class-properties").default,
        {
          loose: true
        }
      ],
      [
        require("@babel/plugin-proposal-object-rest-spread").default,
        {
          useBuiltIns: true
        }
      ],
      require("@babel/plugin-syntax-dynamic-import").default,
      isEnvTest && require("babel-plugin-transform-dynamic-import").default,
      transformRuntime && [
        require("@babel/plugin-transform-runtime").default,
        transformRuntime
      ],
      isEnvProduction &&
        pragma === "React.createElement" && [
          require("babel-plugin-transform-react-remove-prop-types").default,
          {
            removeImport: true
          }
        ]
    ].filter(Boolean)
  };
};
