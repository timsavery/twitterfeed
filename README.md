```javascript
var feed = new (require('twitterfeed'))({
  searchString: '@NodePhilly OR #nodephilly OR #nodejs', // https://dev.twitter.com/docs/using-search
  filterString: 'nodephilly,nodejs', // https://dev.twitter.com/docs/streaming-apis/parameters#track
  cacheLimit: 3 // cycle tweets out of cache after limit is reached
});

feed.init(function() {
  console.log(feed.getCachedTweets()); // cache initialized based on searchString

  feed.stream(function(tweet) {
    console.log(tweet); // stream tweets based on filterString
  });
});
```