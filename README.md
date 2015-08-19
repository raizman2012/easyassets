
> **easyassets** is an open-source client-side asset manager for **Node.JS** and **JAVA** web applications.

There is ONE usage of easyassets: manage lists of static assets. Developer defines entries with '*' character
and this is translated to list of files.

# Why and where to use

With easyassets, you work on your sources, and then generate output that is meant to be consumed by your users.
`easyassets` will take your definition file and give you list of resources as an array. Let's walk through a basic example.

We start off by installing `easyassets`

```bash
$ npm install easyassets --save
```

## Asset definition file

This is a simple configuration file:

```js
{
  "dependencies": [
    "./public/lib/jquery/dist/jquery.min.js",
    "./public/lib/bootstrap/dist/js/bootstrap.min.js",
    "./public/lib/angular/angular.js"
  ],
  "src": [
    "./public/config.js",
    "./public/application.js",
    "./public/translations.js",
    "./public/modules/*/*.js",
    "./public/modules/*/*/*.js"
  ],
  "tests": ["./public/dev/**/*.js"]
}
```

Let me explain the format. You group your assets into groups. 'dependencies', 'src' are names of the groups


## Example

Now that you know how to configure your assets hash, here's how you use it.


```js

// create instance: first paramaeter if file name and 'prefix' is optional parameter,
// used to 'prepend' string for each filename in definitions file
var easyAssetsInstance = new easyassets('spec/examples/assets/javascript.json',
                {prefix : 'spec/examples'});

// get list of all assets
var list = easyAssetsInstance.get();

// get list of assets in group 'src'
var list = easyAssetsInstance.get('src');

// get list of assets in group 'tests'
var list = easyAssetsInstance.get('tests');

// get list of assets in group 'src' AND 'tests'
var list = easyAssetsInstance.get(['src', 'tests']);
```


## add more files: its easy.

Sometimes you may want to add more definition files

```js

easyAssetsInstance.loadFile('anotherfile.json', { prefix: 'some/prefix'});

```

## Common use cases

Often you'll want to add assets in different places in your application:
 - Grunt
 - Server side dynamic html creation (Swig, JSP)
 - Express.js
