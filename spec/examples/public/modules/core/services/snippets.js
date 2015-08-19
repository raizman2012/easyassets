'use strict';

//singletone for keeping all snippets mess in one place
angular.module('core').factory('snippets', ['$http', 'selectable', 'paging',
    function ($http, selectable, paging) {
        var _this = this;

        _this.error = undefined;
        _this.allSnippets = undefined;


        _this.resultViewTypes = new selectable(['list', 'picture-o']);
        _this.resultViewTypes.selectIndex(1);

        _this.snippets = {};
        _this.filteredSnippets = [];
        _this.tagsSortedByCount = [];
        _this.selectableTags = undefined;
        _this.whatIf = {};
        _this.paging = new paging(0, 10);

        _this.loaded = false;
        _this.loading = false;

        function getTagsCountedAndSorted(allSnippets) {

            // need to master underscore.js to understand this.

            var r = _.chain(allSnippets).each(function (value, key) {
                // this create list of values like [ table : { count : 1 }, panel : { count : 1 },... ]
                return value;
            }).reduce(function (result, value0) {

                // count tags, storing result in 'result' object
                // in form { table : 1, panel : 3, .....}
                _.each(value0, function (value1, key1) {

                    if (result[key1] === undefined) {
                        result[key1] = 0;
                    }
                    result[key1]++;
                });


                return result;
            }, {}).map(function (value, key) {
                // transform totals from object to array
                //console.log('value:', value, ' key ', key);
                return {tagName: key, count: value};
            }).sortBy('count').reverse().value(); // sort by count and reverse

            return r;
        }

        function getSamplesByTags(res, tagsToFind) {

            var r = _.chain(res).map(function (value, key) {
                return {
                    fullFilename: key,
                    fileName: cutPathFromFilename(key),
                    tags: _.keys(value)
                }
            }).reduce(function (result, current) {

                var match = _.intersection(current.tags, tagsToFind).length;
                if (match > 0 && match == tagsToFind.length) {
                    result.push(current);
                } else if (tagsToFind.length === 0) {
                    result.push(current);
                }
                return result;
            }, []).value();


            //console.log('getSamplesByTags:', r);
            return r;
        };

        function calculateWhatIf(whatIf) {
            var selectedTagsNames = _.chain(_this.selectableTags.multiSelectedObjects).map(function (value) {
                return value.tagName;
            }).value();
            //console.log('selectedTagsNames:', selectedTagsNames);
            var res = _.reduce(_this.tagsSortedByCount, function (result, current) {
                //console.log(current.tagName);
                var whatIfTags = selectedTagsNames.slice(0);
                whatIfTags.push(current.tagName);
                var rr = getSamplesByTags(_this.snippets, whatIfTags);
                result[current.tagName] = rr.length;
                return result;
            }, whatIf);

            return res;
        }

        function cutPathFromFilename(fileName) {
            var lastIndex = fileName.lastIndexOf('/');
            if (lastIndex === -1) return fileName;
            return fileName.substring(lastIndex + 1);
        }

        _this.selectTag = function (tag) {
            _this.selectedTags[tag] = true;
        }

        _this.unselectTag = function (tag) {
            _this.selectedTags[tag] = false;
        }

        // return snippetId
        _this.goToSnippet = function (snippetId) {
            return cutPathFromFilename(snippetId).replace('.html', '');
        }

        _this.load = function (callback) {
            if (_this.loading) {
                return;
            }
            if (_this.loaded) {
                callback();
                return;
            }

            _this.loading = true;
            $http.get('/snippets?search=ready').
                success(function (data, status, headers, config) {

                    _this.snippets = data;
                    _this.tagsSortedByCount = getTagsCountedAndSorted(_this.snippets);
                    _this.selectableTags = new selectable(_this.tagsSortedByCount);

                    _this.selectableTags.fireChangeMultiSelectionEvent = function () {

                        var selectedTagsNames = _.chain(_this.selectableTags.multiSelectedObjects).map(function (value) {
                            return value.tagName;
                        }).value();

                        // do not replace, change in place
                        _this.filteredSnippets.splice(0,_this.filteredSnippets.length);
                        var newArray = getSamplesByTags(_this.snippets, selectedTagsNames);
                        for (var i = 0, len = newArray.length; i < len; ++i) {
                            _this.filteredSnippets.push(newArray[i]);
                        };

                        // update total items in paging
                        _this.paging.totalItems = _this.filteredSnippets.length;
                        _this.paging.setPage(0);

                        calculateWhatIf(_this.whatIf);
                    }


                    _this.selectableTags.fireChangeMultiSelectionEvent();
                    _this.loading = false;
                    _this.loaded = true;
                    callback();
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('error data:', data);
                    _this.error = data;
                    _this.loading = false;
                    _this.loaded = true;
                    callback();
                });
        };

        return _this;
    }
]);
