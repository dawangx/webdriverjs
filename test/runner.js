var Mocha     = require('mocha'),
    SauceLabs = require('saucelabs'),
    glob      = require('glob'),
    env       = process.env._ENV || 'desktop',
    client;

/**
 * Only execute cross browser tests on changes within master branch.
 * For tests caused by pull requests PhantomJS tests are sufficient.
 */
if (process.env.TRAVIS_BUILD_NUMBER && (
   (process.env.TRAVIS_BRANCH === 'master' && process.env._BROWSER === 'phantomjs') ||
   (process.env.TRAVIS_BRANCH !== 'master' && process.env._BROWSER !== 'phantomjs'))) {
    console.log('This test was skipped');
    process.exit(0);
}

var mocha = new Mocha({
    timeout: 1000000,
    reporter: 'spec'
});

glob('{test/spec/' + env + '/*.js,test/spec/*.js}', function (er, files) {
    
    files.forEach(function(file) {
        mocha.addFile(file);
    });

    mocha.run(function(failures) {
        client.end(function() {

            if(process.env.TRAVIS_BUILD_NUMBER) {
                var sauceAccount = new SauceLabs({
                    username: process.env.SAUCE_USERNAME,
                    password: process.env.SAUCE_ACCESS_KEY
                });

                sauceAccount.updateJob(client.requestHandler.sessionID, {
                    passed: failures === 0,
                    public: true
                },function(err,res){
                    console.log(err || res);
                });
            }
        });
    });
});

// globals for tests
conf   = require('./conf/index.js');
assert = require('assert');

h = {
    noError: function(err) {
        assert(err === null);
    },
    checkResult: function(expected) {
        return function(err, result) {
            h.noError(err);
            assert.strictEqual(result, expected);
        };
    },
    setup: (function() {
        return function(done) {
            var wdjs = require('../index.js');

            if (client) {
                this.client = client;
            } else {
                this.client = client = new wdjs(conf).init();
            }

            this.client.url(conf.testPage.start, done);
        };
    })()
};