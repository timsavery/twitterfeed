```javascript
feed = new (require('twitterfeed'))({
  searchString: '@NodePhilly OR #nodephilly OR #nodejs', // see: https://dev.twitter.com/docs/using-search
  filterString: 'nodephilly,nodejs', // see: https://dev.twitter.com/docs/streaming-apis/parameters#track
  cacheLimit: 3
});

feed.init(function() {
  console.log(feed.getCachedTweets()); // cache initialized based on searchString

  feed.stream(function(tweet) {
    console.log(tweet); // stream tweets based on filterString
  });
});
```