var express = require('express');
var router = express.Router();
var passport = require('passport');

const { simulateRequestOverKafka } = require('../KafkaRequestSimulator');

// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });

// Get all tweets for a given user
// sample response:
/*
    [
        {
            "tweet": {
                "tweetID": "3bcb631e-c872-4b4b-beb0-db706893914a",
                "tweet": "Minus molestias alias exercitationem excepturi et. #swag #sunset #home #smile #art #instalike ",
                "tweetImage": "",
                "tweetOwnerID": "062F71CC-EEDB-C475-0475-0007347D2915",
                "likeCount": 3,
                "tweetDate": "2019-11-16T20:05:33.187Z",
                "viewCount": 0,
            },
            "likeCount": 2,
            "replyCount": 0,
            "retweetCount": 2
        }
    ]
*/

//Get the tweets written by user
router.get('/tweets', requireAuth, async function (req, res, next) {
    const { userID } = req.query;
    try {
        //tweet object
        const tweet = {
            tweetOwnerID: userID
        };
        results = await simulateRequestOverKafka("getTweets", tweet);
        if (results.length > 0) {
            const allTweetIds = results.map(t => t.tweetID);
            // get all users, likeCount, retweetCount and replyCount in parallel
            const [likeCounts, retweetCounts, replyCounts] = await Promise.all([
                simulateRequestOverKafka("getLikeCount", allTweetIds),
                simulateRequestOverKafka("getRetweetCount", allTweetIds),
                simulateRequestOverKafka("getReplyCount", allTweetIds)
            ]);
            results = results.map(res => ({
                tweet: res,
                likeCount: likeCounts[res.tweetID],
                replyCount: replyCounts[res.tweetID],
                retweetCount: retweetCounts[res.tweetID]
            }));
        }
        return res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//get tweets liked by user
router.get('/likes', requireAuth, async function (req, res, next) {
    let likedTweetID = [], tweetUserID = [];
    const { userID } = req.query;
    try {
        const like = { userID };
        let likes = await simulateRequestOverKafka("getLike", like);
        //Create an array with tweetID 
        for (let i = 0; i < likes.length; i++) {
            likedTweetID.push(likes[i].tweetID);
        }
        //tweet object to find in MongoDB with in operator
        const tweet = {
            tweetID: { $in: likedTweetID }
        };
        let tweets = await simulateRequestOverKafka("getTweets", tweet);
        tweets.forEach(user => {
            tweetUserID.push(user.tweetOwnerID)
        });
        const user = {
            userID: tweetUserID
        }
        let { results } = await simulateRequestOverKafka("getUsers", user);
        // parse and respond
        const usersMap = results.reduce((acc, result) => {
            acc[result.userID] = result;
            return acc;
        }, {});
        const tweetsMap = tweets.reduce((acc, tweet) => {
            acc[tweet.tweetID] = {
                tweet,
                user: usersMap[tweet.tweetOwnerID],
            }
            return acc;
        }, {});
        res.json(Object.keys(tweetsMap).map(key => tweetsMap[key]));
        // res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//get retweets by user
router.get('/retweets', requireAuth, async function (req, res, next) {
    let retweetTweetID = [], tweetUserID = [];
    const { userID } = req.query;
    try {
        const retweet = {
            retweetOwnerID: userID,
        }
        let retweets = await simulateRequestOverKafka("getRetweet", retweet);
        retweets.forEach(retwt => {
            retweetTweetID.push(retwt.tweetID);
        });
        const tweet = {
            tweetID: { $in: retweetTweetID }
        }
        let tweets = await simulateRequestOverKafka("getTweets", tweet);
        tweets.forEach(user => {
            tweetUserID.push(user.tweetOwnerID)
        });
        const user = {
            userID: tweetUserID
        }
        let { results } = await simulateRequestOverKafka("getUsers", user);
        // parse and respond
        const usersMap = results.reduce((acc, result) => {
            acc[result.userID] = result;
            return acc;
        }, {});
        const tweetsMap = tweets.reduce((acc, tweet) => {
            acc[tweet.tweetID] = {
                tweet,
                user: usersMap[tweet.tweetOwnerID],
                retweets: []
            }
            return acc;
        }, {});
        retweets.forEach(ret => tweetsMap[ret.tweetID]["retweets"].push(ret));
        res.json(Object.keys(tweetsMap).map(key => tweetsMap[key]));
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//get replies by user
/*
    [
        {
            "tweet": {
                "tweetID": "f3a8fe51-60d7-477a-b468-2584c0e46d37",
                "tweet": "Et expedita asperiores. #instalove #travel #photo #girl #follow #sweet ",
                "tweetImage": "",
                "tweetOwnerID": "12C7629D-014A-E4D1-ED54-70522B979839", // KEY
                "tweetDate": "2019-11-10T17:09:13.602Z",
            },
            // user who tweeted
            "user":{
                "userID": "12C7629D-014A-E4D1-ED54-70522B979839",  // KEY
                "email": "non@Vestibulumanteipsum.com",
                "firstName": "Lyle",
                "lastName": "Bowen",
                "userName": "Chaim",
                "profileImage": null,
            },
            // replies from the other use (req.query.userID)
            "replies": [
                {
                    "replyID": "0bb11285-473f-4838-8dd9-2d3d6fcf6059",
                    "reply": "this tweet is worth reading, well said !",
                    "tweetID": "f3a8fe51-60d7-477a-b468-2584c0e46d37",
                    "replyDate": "2019-11-27T01:31:42.000Z",
                    "replyOwnerID": "5317c26d-87fe-4de8-935a-5bc7bad2987a",
                    "replyImage": "",
                }
            ]
        }
    ]
*/
router.get('/replies', requireAuth, async function (req, res, next) {
    let repliedTweetID = [], tweetUserID = [];
    const { userID } = req.query;
    try {
        const reply = {
            replyOwnerID: userID,
        }
        let replies = await simulateRequestOverKafka("getReply", reply);
        replies.forEach(reply => {
            repliedTweetID.push(reply.tweetID);
        });
        const tweet = {
            tweetID: { $in: repliedTweetID }
        }
        let tweets = await simulateRequestOverKafka("getTweets", tweet);
        tweets.forEach(user => {
            tweetUserID.push(user.tweetOwnerID)
        });
        const user = {
            userID: tweetUserID
        }
        let { results } = await simulateRequestOverKafka("getUsers", user);

        // parse and respond
        const usersMap = results.reduce((acc, result) => {
            acc[result.userID] = result;
            return acc;
        }, {});
        const tweetsMap = tweets.reduce((acc, tweet) => {
            acc[tweet.tweetID] = {
                tweet,
                user: usersMap[tweet.tweetOwnerID],
                replies: []
            }
            return acc;
        }, {});
        replies.forEach(reply => tweetsMap[reply.tweetID]["replies"].push(reply));
        res.json(Object.keys(tweetsMap).map(key => tweetsMap[key]));
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//get given users followed person's
router.get('/followed', requireAuth, async function (req, res, next) {
    const { userID } = req.query;
    try {
        let { results } = await simulateRequestOverKafka("getFollowedUsers", { userID });
        if (results.length > 0) {
            const followedUsers = JSON.parse(JSON.stringify(results));
            const followedUserIds = followedUsers.map(f => f.followedID);
            // get all user details from all followed users
            const { results: allFollowedUsers } = await simulateRequestOverKafka("getUsers", { userID: followedUserIds });
            const followedUsersMap = allFollowedUsers.reduce((acc, f) => {
                acc[f.userID] = f;
                return acc;
            }, {});
            results = results.map(res => followedUsersMap[res.followedID]);
        }
        return res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//get given users followers person
router.get('/followers', requireAuth, async function (req, res, next) {
    const { userID } = req.query;
    try {
        let { results } = await simulateRequestOverKafka("getFollowers", { userID });
        if (results.length > 0) {
            const followers = JSON.parse(JSON.stringify(results));
            const followerIds = followers.map(f => f.followerID);
            // get all user details from all followed users
            const { results: allFollowerUsers } = await simulateRequestOverKafka("getUsers", { userID: followerIds });
            const followerUsersMap = allFollowerUsers.reduce((acc, f) => {
                acc[f.userID] = f;
                return acc;
            }, {});
            results = results.map(res => followerUsersMap[res.followerID]);
        }
        return res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});

module.exports = router;