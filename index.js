"use strict";
let js = [];
let run = 0;
let outputFileNameRegex = [];

function HtmlWebpackMultiBuildPlugin(options) {
  this.options = options;
}

HtmlWebpackMultiBuildPlugin.prototype = {
  apply: function(compiler) {
    this.createOutputRegexes(compiler.options);

    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap(
        "HtmlWebpackMultiBuildPlugin",
        compilation => {
          if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
              "HtmlWebpackMultiBuildPlugin",
              this.beforeHtmlGeneration.bind(this)
            );
          } else {
            var HtmlWebpackPlugin = require("html-webpack-plugin");
            var hooks = HtmlWebpackPlugin.getHooks(compilation);
            hooks.beforeAssetTagGeneration.tapAsync(
              "HtmlWebpackMultiBuildPlugin",
              this.beforeHtmlGeneration.bind(this)
            );
          }
        }
      );
    } else {
      compiler.plugin("compilation", compilation => {
        compilation.plugin(
          "html-webpack-plugin-before-html-generation",
          this.beforeHtmlGeneration.bind(this)
        );
      });
    }
  },
  beforeHtmlGeneration: function(data, cb) {
    this.clearOldScripts(data);
    ++run;
    js = js.concat(data.assets.js);
    data.assets.js = js;
    if (run === 2) {
      data.plugin.options.modernScripts = js.filter(
        value => value.indexOf("legacy") === -1
      );
      data.plugin.options.legacyScripts = js.filter(
        value => value.indexOf("legacy") > 0
      );
    }

    cb(null, data);
  },
  createOutputRegexes: function(options) {
    if (options.output && options.output.filename) {
      // default webpack entry
      let entry = ["main"];
      if (options.entry) {
        // when object is provided we have custom entry names
        if (typeof options.entry === "object") {
          entry = Object.keys(options.entry);
        }
      }
      entry.forEach(e => {
        const outFilePathForEntry = options.output.filename.replace(
          "[name]",
          e
        );
        const matches = outFilePathForEntry.match(/\[hash(:\d+)?]/);
        if (matches) {
          // max hash length is 20 characters so limit the regex to 20
          const hashLength = matches[1] ? +matches[1].substr(1) : 20;
          outputFileNameRegex.push(
            new RegExp(
              outFilePathForEntry.replace(
                matches[0],
                `[\\w\\d]{${Math.min(hashLength, 20)}}`
              )
            )
          );
        }
      });
    }
  },
  clearOldScripts: function(data) {
    outputFileNameRegex.forEach(r => {
      data.assets.js.forEach(a => {
        // we have one of our entries
        if (r.test(a)) {
          js = js.filter(j => !r.test(j));
        }
      });
    });
  }
};

module.exports = HtmlWebpackMultiBuildPlugin;
