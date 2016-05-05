/**
 * Created by Zhi on 2016/4/6.
 *
 */
var assert = require("assert"),
    request = require('supertest');

describe('Array', function(){
    before(function(){

    });

    describe('#indexOf()', function(){
        it('should return -1 when value is not present', function () {
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    });

    after(function(){

    });
});

describe('router testing', function(){
    it('site root response', function(done){
        request()
    })
});