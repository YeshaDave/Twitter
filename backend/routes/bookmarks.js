var express = require("express");
var router = express.Router();
var passport = require("passport");
const { simulateRequestOverKafka } = require("../KafkaRequestSimulator");
// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });

//Create a list
router.post("/create", requireAuth, async function (req, res, next) {
  const { tweetID } = req.body;

  try {
    const loggedInUser = req.user;
    const bookmarks = {
      userID: loggedInUser.userID,
      tweetID: tweetID
    };
    await simulateRequestOverKafka("setBookmarks", bookmarks);
    res.json({ message: "Bookmarks Created" });
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

router.get("/", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const bookmarks = {
      userID: loggedInUser.userID
    };
    TweetID = [];
    const results = await simulateRequestOverKafka("getBookmarks", bookmarks);
    //res.json(results);
    results.forEach(retwt => {
      TweetID.push(retwt.tweetID);
    });
    const tweet = {
      tweetID: { $in: TweetID }
    };

    let tweets = await simulateRequestOverKafka("getTweets", tweet);
    const allTweetIds = tweets.map(t => t.tweetID);
    const allTweetOwner = tweets.map(t => t.tweetOwnerID);

    // get all users, likeCount, retweetCount and replyCount in parallel
    const [
      { results: allFollowedUsers },
      likeCounts,
      retweetCounts,
      replyCounts
    ] = await Promise.all([
      simulateRequestOverKafka("getUsers", { userID: allTweetOwner }),
      simulateRequestOverKafka("getLikeCount", allTweetIds),
      simulateRequestOverKafka("getRetweetCount", allTweetIds),
      simulateRequestOverKafka("getReplyCount", allTweetIds)
    ]);
    console.log(allTweetIds);
    // merge all results as so as to produce a response structure something like:
    /*
                [
                    {
                        tweet: {..tweetObject},
                        user: {..userObject},
                        likeCount: 10,
                        replyCount: 10,
                        retweetCount: 10
                    }
                ]
            */
    const followedUsersMap = allFollowedUsers.reduce((acc, f) => {
      acc[f.userID] = f;
      return acc;
    }, {});
    resultsf = tweets.map(res => ({
      tweet: res,
      user: followedUsersMap[res.tweetOwnerID],
      likeCount: likeCounts[res.tweetID],
      replyCount: replyCounts[res.tweetID],
      retweetCount: retweetCounts[res.tweetID]
    }));

    return res.json(resultsf);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

router.post("/delete", requireAuth, async function (req, res, next) {
  const { tweetID, bookmarksID } = req.body;
  try {
    const loggedInUser = req.user;
    const bookmarks = {
      userID: loggedInUser.userID,
      tweetID: tweetID
    };
    await simulateRequestOverKafka("deleteBookmarks", bookmarks);
    res.json({ message: "Bookmarks Deleted" });
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

module.exports = router;
