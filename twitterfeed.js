var events = require('events')
  , util = require('util');

function TwitterFeed(options) {
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

	this.start = function(callback) {
		var self = this;

		twitter.search(searchString, {}, function(err, tweets) {
			if (err) {
				self.emit('error', err);
			} else {		
				tweets.results.forEach(function(tweet) {
					addTweetToCache(tweet);

					self.emit('tweet', tweet);
				});				

				twitter.stream('statuses/filter', { track: filterString }, function(stream) {
					stream.on('data', function(tweet) {
						addTweetToCache(tweet);

						self.emit('tweet', tweet);
					});

					stream.on('error', function(error, statusCode) {
						self.emit('error', error, statusCode);
					});

					stream.on('end', function(response) {
						self.emit('end', response);
					});

					stream.on('destroy', function(response) {
						self.emit('destroy', response);
					});
				});
			}
		});

		return self;
	};

	this.getCachedTweets = function() {
		return cache;
	};

	var addTweetToCache = function(tweet) {
		if (cache.length > cacheLimit) {
			cache.push(tweet);
			cache = cache.splice(0, cacheLimit);						
		} else {
			cache.push(tweet);						
		}
	};
};

util.inherits(TwitterFeed, events.EventEmitter);

module.exports = TwitterFeed;