'use strict';

function HtmlWebpackMultiBuildPlugin(options) {
  this.options = options;
  this.outputFileNameRegex = [];
  this.js = [];
}

HtmlWebpackMultiBuildPlugin.prototype = {
  apply: function (compiler) {
    this.createOutputRegexes(compiler.options);

    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap('HtmlWebpackMultiBuildPlugin', compilation => {
        compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
          'HtmlWebpackMultiBuildPlugin',
          this.beforeHtmlGeneration.bind(this)
        );
      });
    } else {
      compiler.plugin('compilation', compilation => {
        compilation.plugin('html-webpack-plugin-before-html-generation', this.beforeHtmlGeneration.bind(this));
      });
    }
  },

  beforeHtmlGeneration: function (data, cb) {
    this.clearOldScripts(data);
    this.js = this.js.concat(data.assets.js);
    data.assets.js = this.js;
    data.plugin.options.modernScripts = this.js.filter(value => value.indexOf('legacy') === -1);
    data.plugin.options.legacyScripts = this.js.filter(value => value.indexOf('legacy') > 0);
    cb(null, data);
  },
  createOutputRegexes: function (options) {
    if (options.output && options.output.filename) {
      // default webpack entry
      let entry = ['main'];
      if (options.entry) {
        // when object is provided we have custom entry names
        if (typeof options.entry === 'object') {
          entry = Object.keys(options.entry);
        }
      }
      entry.forEach(e => {
        const outFilePathForEntry = options.output.filename.replace('[name]', e);
        const matches = outFilePathForEntry.match(/\[hash(:\d+)?]/);
        if (matches) {
          // max hash length is 20 characters so limit the regex to 20
          const hashLength = matches[1] ? +matches[1].substr(1) : 20;
          this.outputFileNameRegex.push(
            new RegExp(outFilePathForEntry.replace(matches[0], `[\\w\\d]{${Math.min(hashLength, 20)}}`))
          );
        }
      });
    }
  },
  clearOldScripts: function (data) {
    this.outputFileNameRegex.forEach(r => {
      data.assets.js.forEach(a => {
        // we have one of our entries
        if (r.test(a)) {
          this.js = this.js.filter(j => !r.test(j));
        }
      });
    });
  },
};

module.exports = HtmlWebpackMultiBuildPlugin;
