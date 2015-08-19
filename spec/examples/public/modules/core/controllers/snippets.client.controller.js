'use strict';


angular.module('core').controller('SnippetsController', ['$scope', '$window', '$location', 'snippets',
    function ($scope, $window, $location, snippets) {

        function selectTags(tags) {
            if (tags !== undefined) {
                var tagsArray = tags.split(',');


                _.each(tagsArray, function(tag) {
                    var i = _.findIndex($scope.selectableTags.list, function(o) {
                        return o.tagName === tag;
                    });
                    $scope.selectableTags.multiSelect(i);
                });
            }
        }

        //angular.extend($scope, snippets);
        snippets.load(function() {
            angular.extend($scope, snippets);

            // restore selection
            var tags = $location.search().tags;
            selectTags(tags);
        });


        $scope.$on('$locationChangeStart', function(event) {
            var tags = $location.search().tags;
            if (tags !== undefined) {
                console.log('$locationChangeStart tags', tags);
                $scope.selectableTags.unselectAll();

                selectTags(tags);
                $window.document.title = 'Snippets:'+tags;
            }

        });

        $scope.removeTag = function(index) {
            $scope.selectableTags.multiUnselect(index);
            var tags = _.map($scope.selectableTags.multiSelectedObjects, function(o) {
                return o.tagName;
            }).join(',');

            console.log('tags:',tags);
            $location.search('tags', '' + tags);
            $window.document.title = 'Snippets:'+tags;
        }

        $scope.addTag = function(index) {
            $scope.selectableTags.multiSelect(index);

            var tags = _.map($scope.selectableTags.multiSelectedObjects, function(o) {
                return o.tagName;
            }).join(',');

            console.log('tags:',tags);
            $location.search('tags', '' + tags);
            $window.document.title = 'Snippets:'+tags;
        }

    }
]);
