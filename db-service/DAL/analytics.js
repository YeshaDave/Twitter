const { tweets } = require("./Models/TweetSchema");
const { profileview } = require("./Models/ProfileViewSchema");
const { likes } = require("./Models/LikeSchema");
const { retweets } = require("./Models/RetweetSchema");

const getTweetViewCount = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    tweets
      .find(function (err, docs) {
        return err ? reject(err) : resolve(docs);
      })
      .sort({ viewCount: -1 })
      .limit(10);
  });
};

const getTweetLikeCount = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    likes
      .aggregate(
        [{ $group: { _id: "$tweetID", count: { $sum: 1 } } }],
        function (err, docs) {
          return err ? reject(err) : resolve(docs);
        }
      )
      .limit(10);
  });
};

const getARetweetCount = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    retweets
      .aggregate(
        [{ $group: { _id: "$tweetID", count: { $sum: 1 } } }],
        function (err, docs) {
          return err ? reject(err) : resolve(docs);
        }
      )
      .limit(5);
  });
};

const getTweetCountHour = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    tweets.aggregate(
      [
        {
          $group: {
            _id: {
              h: { $hour: "$tweetDate" },
              d: { $dayOfMonth: "$tweetDate" },
              m: { $month: "$tweetDate" },
              y: { $year: "$tweetDate" }
            },
            count: { $sum: 1 }
          }
        },
        { $project: { tweet: 1, count: 1 } }
      ],
      function (err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};
const getTweetCountDay = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    tweets.aggregate(
      [
        {
          $group: {
            _id: {
              d: { $dayOfMonth: "$tweetDate" },
              m: { $month: "$tweetDate" },
              y: { $year: "$tweetDate" }
            },
            count: { $sum: 1 }
          }
        },
        { $project: { tweet: 1, count: 1 } }
      ],
      function (err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};

const getTweetCountMonth = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    tweets.aggregate(
      [
        {
          $group: {
            _id: {
              m: { $month: "$tweetDate" },
              y: { $year: "$tweetDate" }
            },
            count: { $sum: 1 }
          }
        },
        { $project: { tweet: 1, count: 1 } }
      ],
      function (err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};

const getProfileViewCount = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    const userID = query.userID;

    profileview.aggregate(
      [
        { $match: { userID: userID } },
        {
          $group: {
            _id: {
              d: { $dayOfMonth: "$viewDate" },
              m: { $month: "$viewDate" },
              y: { $year: "$viewDate" },
              userID: "$userID"
            },
            count: { $sum: 1 }
          }
        }
      ],
      function (err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};

const IncTweetViewCount = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    const tweetID = query.tweetID;
    tweets.updateOne({ tweetID: tweetID }, { $inc: { viewCount: 1 } }, function (
      err,
      docs
    ) {
      return err ? reject(err) : resolve(docs);
    });
  });
};
const IncProfileViewCount = connection => (query = {}) => {
  return new Promise((resolve, reject) => {
    const userID = query.userID;
    profileview.updateOne(
      { userID: userID, viewDate: Date.now() },
      {
        $set: { viewDate: Date.now() },
        $inc: { viewCount: 1 }
      },
      { upsert: true },
      function (err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};
module.exports = {
  getTweetViewCount,
  getTweetLikeCount,
  getARetweetCount,
  getTweetCountHour,
  getTweetCountDay,
  getTweetCountMonth,
  getProfileViewCount,
  IncTweetViewCount,
  IncProfileViewCount
};
