module.exports = function(options) {
	if (!options) { options = {}; }

	var consumer_key = options.consumer_key || process.env.TWITTER_CONSUMER_KEY
	  , consumer_secret = options.consumer_secret || process.env.TWITTER_CONSUMER_SECRET
	  , access_token_key = options.access_token_key || process.env.TWITTER_ACCESS_TOKEN_KEY
	  , access_token_secret = options.access_token_secret || process.env.TWITTER_ACCESS_TOKEN_SECRET	  
	  , searchString = options.searchString
	  , filterString = options.filterString
	  , cacheLimit = options.cacheLimit || 15
	  , cache = [];

	if (!searchString) {
		throw new Error('Missing search string.');
	}

	if (!filterString) {
		throw new Error('Missing filter string.');
	}

	if (!consumer_key) {
		throw new Error('Missing twitter consumer key.');
	}

	if (!consumer_secret) {
		throw new Error('Missing twitter consumer secret.');
	}

	if (!access_token_key) {
		throw new Error('Missing twitter access token key.');
	}

	if (!access_token_secret) {
		throw new Error('Missing twitter access token secret.');
	}

	var twitter = new (require('ntwitter'))({
  	consumer_key: consumer_key,
  	consumer_secret: consumer_secret,
  	access_token_key: access_token_key,
  	access_token_secret: access_token_secret
  });

  var tweetStream = null
    , tweetHandler = null;

	this.init = function(callback) {
		twitter.search(searchString, {}, function(err, tweets) {
				if (err) {
					return callback(err);
				}

				tweets.results.forEach(function(tweet) {
					if (cache.length > cacheLimit) {
						cache.push(tweet);
						cache = cache.splice(0, cacheLimit);						
					} else {
						cache.push(tweet);						
					}
				});				

				callback(null, tweets);
		});
	};

	this.stream = function(tweetHandler, callback) {
		tweetHandler = tweetHandler || function() {};

		twitter.stream('statuses/filter', { track: filterString }, function(stream) {
			stream.on('data', function(tweet) {
				tweetHandler(tweet);
			});

			stream.on('error', function(error) {
				throw new Error('Twitter stream errored: ' + JSON.stringify(error));
			});

			stream.on('end', function(response) {
				throw new Error('Twitter stream disconnected: ' + JSON.stringify(response));
			});

			stream.on('destroy', function(response) {
				throw new Error('Twitter stream destroyed: ' + JSON.stringify(response));
			});

			tweetStream = stream;

			if (callback) callback();
		});
	};

	this.getCachedTweets = function() {
		return cache;
	};
};