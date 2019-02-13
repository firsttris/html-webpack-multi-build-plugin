'use strict';
function HtmlWebpackMultiBuildPlugin(options) {
    this.options = options;
    this.js = [];
}

HtmlWebpackMultiBuildPlugin.prototype = {
    apply: function(compiler) {
        if (compiler.hooks) {
            // webpack 4 support
            compiler.hooks.compilation.tap('HtmlWebpackMultiBuildPlugin', compilation => {
                compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tap(
                    'HtmlWebpackMultiBuildPlugin',
                    this.beforeHtmlGeneration.bind(this),
                );
            });
        } else {
            compiler.plugin('compilation', compilation => {
                compilation.plugin('html-webpack-plugin-before-html-generation', this.beforeHtmlGeneration.bind(this));
            });
        }
    },

    beforeHtmlGeneration: function(data, cb) {
        this.js = this.js.concat(data.assets.js);
        data.assets.js = this.js;
        data.plugin.options.modernScripts = this.js.filter((value) => value.indexOf('legacy') === -1);
        data.plugin.options.legacyScripts = this.js.filter((value) => value.indexOf('legacy') > 0);
        if (cb) {
          cb(null, data);
        }
    },
};

module.exports = HtmlWebpackMultiBuildPlugin;
