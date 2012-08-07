```javascript
var TwitterFeed = new (require('twitterfeed'))({
  searchString: '@NodePhilly OR #nodephilly OR #nodejs', // https://dev.twitter.com/docs/using-search
  filterString: 'nodephilly,nodejs', // https://dev.twitter.com/docs/streaming-apis/parameters#track
  cacheLimit: 3 // cycle tweets out of cache after limit is reached
});

var feed = TwitterFeed.start();

feed.on('tweet', function(tweet) {
	console.log('TWEET :: %s', JSON.stringify(tweet));
});

feed.on('error', function(error) {
	console.log('ERROR :: %s', JSON.stringify(error));
});

function printCachedTweets() {
	feed.getCachedTweets().forEach(function(tweet) {
		console.log('CACHED TWEET :: %s', JSON.stringify(tweet));
	});
};

setTimeout(printCachedTweets, 3000);
```