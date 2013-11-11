/*globals describe, before, beforeEach, afterEach, it */
var testUtils = require('../../utils'),
    should = require('should'),
    _ = require('underscore'),
    request = require('request');

request = request.defaults({jar:true})

describe('Post API', function () {

    var user = testUtils.DataGenerator.forModel.users[0],
        csrfToken = '';

    before(function (done) {
        testUtils.clearData()
            .then(function () {
                done();
            }, done);
    });

    beforeEach(function (done) {
         testUtils.initData()
            .then(function () {
                return testUtils.insertDefaultFixtures();
            })
            .then(function () {
                // do a get request to get the CSRF token first
                request.get(testUtils.API.getSigninURL(), function (error, response, body) {
                    response.should.have.status(200);
                    var pattern_meta = /<meta.*?name="csrf-param".*?content="(.*?)".*?>/i;
                    pattern_meta.should.exist;
                    csrfToken = body.match(pattern_meta)[1];
                    setTimeout((function() {
                        request.post({uri:testUtils.API.getSigninURL(),
                                headers: {'X-CSRF-Token': csrfToken}}, function (error, response, body) {
                            response.should.have.status(200);
                            done();
                        }).form({email: user.email, password: user.password});
                    }), 2000);
                });
            }, done);
    });

    afterEach(function (done) {
        testUtils.clearData().then(function () {
            done();
        }, done);
    });    

    it('can create a new draft, publish post, update post', function (done) {
        var newTitle = 'My Post',
            changedTitle = 'My Post changed',
            publishedState = 'published',
            newPost = {status:'draft', title:newTitle, markdown:'my post'};

        request.post({uri: testUtils.API.getApiURL('posts/'),
                headers: {'X-CSRF-Token': csrfToken},
                json: newPost}, function (error, response, draftPost) {
            response.should.have.status(200);
            //TODO: do drafts really need a x-cache-invalidate header
            response.should.be.json;
            draftPost.should.exist;
            draftPost.title.should.eql(newTitle);
            draftPost.status = publishedState;
            testUtils.API.checkResponse(draftPost, 'post');
            request.put({uri: testUtils.API.getApiURL('posts/' + draftPost.id + '/'),
                    headers: {'X-CSRF-Token': csrfToken},
                    json: draftPost}, function (error, response, publishedPost) {
                response.should.have.status(200);
                response.headers['x-cache-invalidate'].should.eql('/, /page/*, /rss/, /rss/*, /' + publishedPost.slug + '/');
                response.should.be.json;
                publishedPost.should.exist;
                publishedPost.title.should.eql(newTitle);
                publishedPost.status.should.eql(publishedState);
                testUtils.API.checkResponse(publishedPost, 'post');
                request.put({uri: testUtils.API.getApiURL('posts/' + publishedPost.id + '/'),
                        headers: {'X-CSRF-Token': csrfToken},
                        json: publishedPost}, function (error, response, updatedPost) {
                    response.should.have.status(200);
                    response.headers['x-cache-invalidate'].should.eql('/, /page/*, /rss/, /rss/*, /' + updatedPost.slug + '/');
                    response.should.be.json;
                    updatedPost.should.exist;
                    updatedPost.title.should.eql(newTitle);
                    testUtils.API.checkResponse(updatedPost, 'post');
                    done();
                });
            });
        });
    });