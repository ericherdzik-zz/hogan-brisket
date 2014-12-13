Hogan Brisket
=============

Hogan Brisket is an adapter for [Hogan.js](http://twitter.github.io/hogan.js/) templating in a [Brisket](https://github.com/bloomberg/brisket) application.

[![Build Status](https://travis-ci.org/ericherdzik/hogan-brisket.svg)](https://travis-ci.org/ericherdzik/hogan-brisket)

## Getting Started
This Brisket plugin requires Brisket `0.x`

Please refer to [Brisket.View Documentation](https://github.com/bloomberg/brisket/blob/master/docs/brisket.view.md#setting-a-templating-engine) as it describes how to configure Brisket Views for templating.

Note that this plugin does not provide templating or template compilation. It is merely an adapter that enables Brisket to render compiled Hogan.js templates. To integrate Hogan.js into your application, please refer to [Hogan.js](http://twitter.github.io/hogan.js/).

You may install this plugin from your console with the following command:

```bash
npm install hogan-brisket --save
```

## Usage

Once you have Hogan.js integrated into your build, you will have an automatically generated compiled templates file that looks like this somewhere within your application:

```javascript
// templates.js
var Hogan = require('hogan.js');

var t = {
  'templates/index.html' : new Hogan.Template({ ... }),
  'templates/_header.html' : new Hogan.Template({ ... })
},
r = function(n) {
  var tn = t[n];
  return function(c, p, i) {
    return tn.render(c, p || t, i);
  };
};
module.exports = {
  templates : t,
  'templates/index.html' : r('templates/index.html'),
  'templates/_header.html' : r('templates/_header.html')
};
```

To make these templates available in your Brisket View, you simply need to specificy Hogan Brisket as your template adapter:

```javascript
// IndexView.js
var Brisket = require("brisket");
var templates = require("./templates.js");

var IndexView = Brisket.View.extend({

    templateAdapter: require("hogan-brisket")(templates),

    template: "templates/index.html"

});

module.exports = IndexView;
```

## Partials

By defualt, Hogan Brisket makes all partials globally available to all of your templates. Referring to `IndexView` in the previous section, this means that within your `templates/index.html` template you would be able to render the header partial without any extra effort:

```mustache
{{! templates/index.html}}

<header>{{> templates/_header.html}}</header>
```

 However, you may want to disable this behavior and force Hogan Brisket to only expose partials explicity declared in your Brisket View. This is possible by setting the `globalPartials` option to `false` when constructing the adapter:

```javascript
// IndexView.js (with explicit partials)
var Brisket = require("brisket");
var templates = require("./templates.js");

var IndexView = Brisket.View.extend({

    templateAdapter: require("hogan-brisket")(templates, {
        globalPartials: false
    }),

    template: "templates/index.html",

    partials: {
        "header": "templates/_header.html"
    }

});

module.exports = IndexView;
```

In this example, the only partial available within your template would be the header partial. It can be rendered as follows:

```mustache
{{! templates/index.html}}

<header>{{> header}}</header>
```

It is important to note that the partial name matches the key in the partials object on IndexView.

## License

The MIT License (MIT) Copyright (c) 2014 Eric Herdzik

