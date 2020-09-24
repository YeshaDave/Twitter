var express = require("express");
var router = express.Router();
var passport = require("passport");

const { simulateRequestOverKafka } = require("../KafkaRequestSimulator");

// Set up middleware
var requireAuth = passport.authenticate("jwt", { session: false });

//Get the created lists
router.get("/", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const list = {
      ownerID: loggedInUser.userID
    };
    results = await simulateRequestOverKafka("getLists", list);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Get the other users lists
router.get("/others", requireAuth, async function (req, res, next) {
  try {
    const user = req.query.userID;

    const list = {
      ownerID: user
    };
    results = await simulateRequestOverKafka("getLists", list);
    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Create a list
router.post("/create", requireAuth, async function (req, res, next) {
  const { listName, listDesc, isPrivate } = req.body;
  if (!(listName && listDesc)) {
    console.error("Required Details Missing");
    return res.status(400).json({ message: "Required Details Missing" });
  }
  try {
    const loggedInUser = req.user;
    const list = {
      ownerID: loggedInUser.userID,
      listName: listName,
      listDesc: listDesc,
      isPrivate: isPrivate
    };
    await simulateRequestOverKafka("saveLists", list);
    res.json({ message: "List Created" });
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Gets names of lists user is a member of

router.get("/memberships", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const list = {
      members: loggedInUser.userID
    };
    const results = await simulateRequestOverKafka("getMemberships", list);
    const user = { userID: results[0].ownerID };

    let chatRes = await simulateRequestOverKafka("getUsers", user);
    resultsf = results.map(res => ({
      tweet: res,
      user: chatRes

    }));
    res.json(resultsf);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Gets names of lists user has subscribed to

router.get("/subscriptions", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const list = {
      subscribers: loggedInUser.userID
    };
    const results = await simulateRequestOverKafka("getSubscriptions", list);
    const user = { userID: results[0].ownerID };

    let chatRes = await simulateRequestOverKafka("getUsers", user);
    resultsf = results.map(res => ({
      tweet: res,
      user: chatRes

    }));
    res.json(resultsf);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});



//Returns members of selected list


router.get("/members", requireAuth, async function (req, res, next) {
  try {
    members = [];

    const list = {
      ownerID: req.query.userID
    };
    const results = await simulateRequestOverKafka("getMembers", list);

    results[0].members.forEach(mem => members.push(mem));

    quoted = "'" + members.join("','") + "'";
    const user = { usersID: [quoted] };

    let chatRes = await simulateRequestOverKafka("getUsers", user);
    res.json(chatRes.results);
    console.log(chatRes)
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

router.get("/ownmembers", requireAuth, async function(req, res, next) {
  try {
    members = [];

    const list = {
     _id: req.query.listID
    };
    const results = await simulateRequestOverKafka("getMembers", list);

    results[0].members.forEach(mem => members.push(mem));

    quoted = "'" + members.join("','") + "'";
    const user = { usersID: [quoted] };

    let chatRes = await simulateRequestOverKafka("getUsers", user);
    res.json(chatRes.results);
    console.log(chatRes)
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});
router.get("/ownsubscribers", requireAuth, async function(req, res, next) {
  try {
    members = [];

    const list = {
     _id: req.query.listID
    };
    const results = await simulateRequestOverKafka("getSubscribers", list);

        results[0].subscribers.forEach(mem => members.push(mem));


    quoted = "'" + members.join("','") + "'";
    const user = { usersID: [quoted] };

    let chatRes = await simulateRequestOverKafka("getUsers", user);
    res.json(chatRes.results);
    console.log(chatRes)
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Returns subscribers of selected list

router.get("/subscribers", requireAuth, async function (req, res, next) {
  try {
    subscribers = [];
    const list = {
      ownerID: req.query.userID
    };
    const results = await simulateRequestOverKafka("getSubscribers", list);
    results[0].subscribers.forEach(subs => subscribers.push(subs));

    quoted = "'" + subscribers.join("','") + "'";
    const user = { usersID: [quoted] };

    let chatRes = await simulateRequestOverKafka("getUsers", user);
    res.json(chatRes.results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Get the tweets of the followed persons
//Get the tweets of the followed persons
router.get("/tweets", requireAuth, async function (req, res, next) {
  let followID = [];
  try {
    const list = {
      _id: req.query.listID
    };
    //get the members of list from table list
    let results1 = await simulateRequestOverKafka("getMembers", list);
    let followed = results1[0].members;

    //For each member of list get all the tweets from Mongo Tweets collection

    for (let i = 0; i < followed.length; i++) {
      followID.push(followed[i]);
    }
    //tweet object to find in MongoDB with in operator
    const tweet = {
      tweetOwnerID: { $in: followID }
    };
    tweets = await simulateRequestOverKafka("getTweets", tweet);
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
    console.log(resultsf)
    return res.json(resultsf);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Subscribe to a list

router.post("/subscribe", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const { listID } = req.body;
    const list = {
      listID: listID,
      user: loggedInUser.userID
    };
    await simulateRequestOverKafka("setSubscribers", list);
    res.json("Added to Subscribers");
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

// search people for adding as member
router.get("/search", requireAuth, async function (req, res, next) {
  const { fname } = req.query;
  try {
    const user = {
      search: { firstName: fname }
    };
    const { results } = await simulateRequestOverKafka("getUsers", user);

    res.json(results);
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});


//Add member to a list
router.post("/member", requireAuth, async function (req, res, next) {
  try {
    const { userID, listID } = req.body;
    const loggedInUser = req.user;
    const list = {
      listID: listID,
      user: userID
    };
    await simulateRequestOverKafka("setMembers", list);
    res.json("Added to Members");
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Unsubscribe from a list
router.post("/unsubscribe", requireAuth, async function (req, res, next) {
  try {
    console.log(req.body)
    const { listID } = req.body;
    const loggedInUser = req.user;
    const list = {
      _id: listID,
      user: loggedInUser.userID
    };
    await simulateRequestOverKafka("unsetSubscribers", list);
    res.json("Subscriber removed");
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Add member to a list

router.post("/demember", requireAuth, async function (req, res, next) {
  try {
    const { listID } = req.body;

    const list = {
      _id: listID,
      user: req.user.userID
    };
    await simulateRequestOverKafka("unsetMembers", list);
    res.json("Member removed");
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

//Delete list

router.post("/delete", requireAuth, async function (req, res, next) {
  try {
    const loggedInUser = req.user;
    const list = {
      _id: req.body.listID,
      ownerID: loggedInUser.userID
    };
    await simulateRequestOverKafka("deleteList", list);
    res.json("List Deleted");
  } catch (e) {
    res.status(500).send(e.message || e);
  }
});

module.exports = router;
