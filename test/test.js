"use strict"

 var assert = require('assert');
 var request = require('supertest')
 var app = require('../test.serve.js')

 var request = request("http://localhost:8001")

 describe('data', function() {
     describe('GET', function(){
         it('Should return json as default with data', function(done){
             setTimeout(done, 3000);
             request.get('/data')
                 .expect('Content-Type', /json/)
                 .expect(200, done)
         });
     });
 });

 request.get('/data/5/false/score/desc')

 describe('filter data', function() {
    describe('GET', function(){
        it('Should return json as default with data filtered', function(done){
            setTimeout(done, 3000);
            request.get('/data/5/false/score/desc')
                .expect('Content-Type', /json/)
                .expect(200, done);
        })
    });
});