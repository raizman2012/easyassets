/**
 * Created by leonid.raizmen on 17/08/2015.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var lodash = require('lodash');
var glob = require('glob');
var jsonfile = require('jsonfile');

module.exports = function (file, options) {
    var _this = this;

    function cutPrePath(part, list) {
        var res = [];
        for (var i = 0; i < list.length; i++) {
            var s = list[i];
            s = s.substring(part.length);
            res.push(s);
        }
        return res;
    }

    function loadSourceFilesNames(list) {
        var res = [];
        for (var i = 0; i < list.length; i++) {
            var def = list[i];

            if (def.indexOf('*') !== -1) {
                res = res.concat(glob.sync(def, {cwd: ''}));
            } else {
                res.push(def);
            }
        }
        return res;
    }


    function loadFile(filename, options) {
        var json = jsonfile.readFileSync(filename);
        console.log('', json);

        var prefix = '';
        if (options !== undefined && options.prefix !== undefined) {
            prefix = options.prefix;
        }
        for (var keyInJson in json) {
            var list = json[keyInJson];

            var res = [];
            for (var i = 0; i < list.length; i++) {

                var def = prefix+path.sep+list[i];


                if (def.indexOf('*') !== -1) {
                    res = res.concat(glob.sync(def, {cwd: ''}));
                } else {
                    res.push(def);
                }
            }

            if (_this[keyInJson] === undefined) {
                _this[keyInJson] = [];
            }

            _this[keyInJson] = _this[keyInJson].concat(res);
        }
    }

    function get(list) {
        var res = [];
        if (list === undefined) {

            for (var key in _this) {
                if (Array.isArray(_this[key])) {
                    res = res.concat(_this[key]);
                }
            }
            return res;
        } else {
            if (Array.isArray(list)) {

                list.forEach(function(key) {
                    if (Array.isArray(_this[key])) {
                        res = res.concat(_this[key]);
                    }
                });
                return res;
            } else {
                return _this[list];
            }
        }

    }


    if (file !== undefined) {
        loadFile(file, options);
    }


    this.loadFile = loadFile;
    this.get = get;


};