'use strict';

var easyassets = require('../lib/easyassets');

describe("easyassets", function () {
    beforeEach(function (){

    });

    describe("create assets", function () {

        it("should create empty without fail", function () {

            var easyAssetsInstance = new easyassets();

            expect(easyAssetsInstance.src).toEqual(undefined);
        });

        it("should load from file", function () {
            var easyAssetsInstance = new easyassets('spec/examples/assets/javascript.json',
                {prefix : 'spec/examples'});

            expect(easyAssetsInstance.src.length).toEqual(23);

        });

        it("should support queries", function () {
            var easyAssetsInstance = new easyassets('spec/examples/assets/javascript.json',
                {prefix : 'spec/examples'});

            expect(easyAssetsInstance.get().length).toEqual(46);
            expect(easyAssetsInstance.get('src').length).toEqual(23);
            expect(easyAssetsInstance.get('tests').length).toEqual(1);
            expect(easyAssetsInstance.get(['src', 'tests']).length).toEqual(23+1);
        });
    });
});