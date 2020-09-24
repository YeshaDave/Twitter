const { tweets } = require('./Models/TweetSchema');

const getTweets = connection => (tweet = {}) => {
    return new Promise((resolve, reject) => {
        tweets.find(tweet, function (err, docs) {
            return err ? reject(err) : resolve(docs);
        });
    });
};

const saveTweet = connection => (tweet) => {
    let tweetDoc = new tweets(tweet);
    return new Promise((resolve, reject) => {
        tweetDoc.save(function (err, docs) {
            return err ? reject(err) : resolve(docs);
        })
    });
};

const deleteTweet = connection => (tweet) => {
    return new Promise((resolve, reject) => {
        tweets.deleteOne(tweet, function (err, docs) {
            return err ? reject(err) : resolve(docs);
        })
    });
};

const editTweet = connection => (tweet) => {
    return new Promise((resolve, reject) => {
        tweets.updateOne(tweet, { $inc: { likeCount: 1 } }, function (err, docs) {
            return err ? reject(err) : resolve(docs);
        })
    });
};
module.exports = {
    getTweets,
    saveTweet,
    deleteTweet,
    editTweet,
};