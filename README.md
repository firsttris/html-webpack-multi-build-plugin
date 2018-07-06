# html-webpack-multi-build-plugin

This plugin simplifies the creation of script tags for module and nomodule for a webpack multi build configuration.

### Why do you want to do this?

Most developers still transpile their code to ES5 and bundle it with polyfills to provide support for older browsers.
But for newer browsers this transpiled code is unnecessary and probably slower then ES6+ code.
The Idea is to create two bundles, one modern es6+ bundle and one legacy es5 bundle.

### What? How do you do that?
The solution is to provide two script tags, one with type=module (es6+ code) and one with "nomodule" (es5 code).
Modern Browser will now only load the script tag with type=module while legacy browser only load the script tag with "nomodule".

### Will some browser still download both bundles?

Some browser like Safari, IE11, Edge are downloading both bundles, but only executing one. 
This plugin has integrated a clever fix for this.
By creating a script tag with module / nomodule which dynamically injects the actual script tags for the javascript resources.

```
<script type="module">
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'vendors~app_60d33517957366ff05a8.js';
    document.body.appendChild(script);
</script>
```

### Why do i need this addon?
This plugin for html-webpack-plugin generates script tags for module and nomodule for a webpack multi build configuration.

### Async CSS Loading
The included template add's tags for async (non blocking) css
```
<link href="app.css" rel="stylesheet" media="nope!" onload="this.media='all'">
```

### Read about webpack multi build configuration
https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations

### How to use this addon?

Check out my [Example Project](https://github.com/firsttris/html-webpack-multi-build-plugin/tree/master/example)

Summarized

#### Package.json
```
    "scripts": {
        build:multi": "webpack --env.build=multi"
    }
```

#### webpack.config
```  
    // Legacy webpack config needs to include 'legacy' 
    config.output.filename = '[name]_legacy.js';

    // Modern webpack config should not include 'legacy'
    config.output.filename = '[name].js';

    // both webpack configs should include htmlWebpackPlugin and htmlWebpackMultiBuildPlugin

    const htmlWebpackMultiBuildPlugin = require('html-webpack-multi-build-plugin');
    const multiBuildMode = process.env.build === 'multi'

    const template = multiBuildMode 
    ? require.resolve('html-webpack-multi-build-plugin/template.ejs') 
    : require.resolve('html-webpack-plugin/default_index.ejs');

    config.plugins: [
        new htmlWebpackPlugin(
            {
                inject: !multiBuildMode,
                template
            }
        )
        new htmlWebpackMultiBuildPlugin()
    ]
```


### Sources

https://philipwalton.com/articles/deploying-es2015-code-in-production-today/    
https://github.com/philipwalton/webpack-esnext-boilerplate    
https://jakearchibald.com/2017/es-modules-in-browsers/    
https://github.com/jantimon/html-webpack-plugin/issues/782    
https://github.com/philipwalton/webpack-esnext-boilerplate/issues/1