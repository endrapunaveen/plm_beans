var async = require("async");
var sleep = require('sleep');

var hashtag = [1, 2, 3];


/*
async.whilst(
    function () { return 0 == 0 },
    function (callback) {
        async.eachSeries(hashtag, searchTwitter, callback);
    },
    function (err) {
    }
);
*/

async.eachSeries(hashtag, searchTwitter, function() {

});

function searchTwitter(tag, done) {
	console.log('++++ start of : ' + tag);
    sleep.sleep(1); 
    console.log('++++ end of : ' + tag);
    done()
}



        