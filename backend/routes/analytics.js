var express = require("express");
var router = express.Router();
var passport = require("passport");
const { simulateRequestOverKafka } = require('../KafkaRequestSimulator');

// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });

//Update tweet view count
router.post("/inctweetviewcount", requireAuth, async function (req, res, next) {
  try {

    const { tweetID } = req.body;

    const query = {
      tweetID: tweetID
    };
    results = await simulateRequestOverKafka("IncTweetViewCount", query);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
//Update profile view count
router.post("/incprofileviewcount", requireAuth, async function (
  req,
  res,
  next
) {
  try {
    const { userID } = req.body.userID

    const query = {
      userID: userID
    };
    results = await simulateRequestOverKafka("IncProfileViewCount", query);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
//Get the tweets with maximum views
router.get("/viewcount", requireAuth, async function (req, res, next) {
  try {
    const ownerID = []
    const query = {};
    const results = await simulateRequestOverKafka("getTweetViewCount", query);
    results.forEach(retwt => {
      ownerID.push(retwt.tweetOwnerID);
    });

    quoted = "'" + ownerID.join("','") + "'";
    const user = { usersID: [quoted] };

    let { results: allFollowedUsers } = await simulateRequestOverKafka("getUsers", user);


    const followedUsersMap = allFollowedUsers.reduce((acc, f) => {
      acc[f.userID] = f;
      return acc;
    }, {});
    const resultsf = results.map(res => ({
      tweet: res,
      user: followedUsersMap[res.tweetOwnerID]
    }));

    res.json(resultsf)
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

router.get("/likecount", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const query = {};
    results = await simulateRequestOverKafka("getTweetLikeCount", query);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
router.get("/retweetcount", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const likedTweetID = []
    const query = {};
    results = await simulateRequestOverKafka("getARetweetCount", query);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
router.get("/hourcount", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;

    const query = {};
    results = await simulateRequestOverKafka("getTweetCountHour", query);
    //fetch hourly division of tweets from returned results.
    res.json(results);
    // console.log(results.length)
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
router.get("/daycount", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;

    const query = {};
    results = await simulateRequestOverKafka("getTweetCountDay", query);
    //fetch daily division of tweets from returned results.
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
router.get("/monthcount", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;

    const query = {};
    results = await simulateRequestOverKafka("getTweetCountMonth", query);
    //fetch monthly division of tweets from returned results.
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
router.get("/profileviewcount", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;

    const query = {
      userID: loggedInUser.userID
    };
    results = await simulateRequestOverKafka("getProfileViewCount", query);
    //fetch daily division of count from returned results.
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
module.exports = router;
