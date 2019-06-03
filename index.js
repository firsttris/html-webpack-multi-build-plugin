'use strict';
let js = [];
let run = 0;

function HtmlWebpackMultiBuildPlugin(options) {
    this.options = options;
}

HtmlWebpackMultiBuildPlugin.prototype = {
    apply: function(compiler) {
        if (compiler.hooks) {
            // webpack 4 support
            compiler.hooks.compilation.tap('HtmlWebpackMultiBuildPlugin', compilation => {
                if (compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration) {
                  compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
                    'HtmlWebpackMultiBuildPlugin',
                    this.beforeHtmlGeneration.bind(this),
                  );
                } else {
                  var HtmlWebpackPlugin = require('html-webpack-plugin');
                  var hooks = HtmlWebpackPlugin.getHooks(compilation);
                  hooks.beforeAssetTagGeneration.tapAsync(
                      'HtmlWebpackMultiBuildPlugin',
                      this.beforeHtmlGeneration.bind(this),
                  );
                }
            });
        } else {
            compiler.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-before-html-generation', this.beforeHtmlGeneration.bind(this));
            });
        }
    },

    beforeHtmlGeneration: function(data, cb) {
        ++run;
        js = js.concat(data.assets.js);
        data.assets.js = js;
        if (run === 2) {
            data.plugin.options.modernScripts = js.filter((value) => value.indexOf('legacy') === -1);
            data.plugin.options.legacyScripts = js.filter((value) => value.indexOf('legacy') > 0);
        }

        cb(null, data);
    },
};

module.exports = HtmlWebpackMultiBuildPlugin;
