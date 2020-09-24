var express = require('express');
var router = express.Router();
const uuidv4 = require('uuid/v4');
var passport = require('passport');
const multer = require('multer');
const path = require('path');

const { simulateRequestOverKafka } = require('../KafkaRequestSimulator');
const upload = multer({ dest: path.join(__dirname, '..', 'uploads/') });
// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });

// search hashtags or people
router.get('/search', requireAuth, async function (req, res, next) {
    const { topic } = req.query
    try {
        if (topic) {
            //Hashtag search
            if (topic.startsWith("#")) {
                const tweet = { $text: { $search: topic } };
                const tweets = await simulateRequestOverKafka("getTweets", tweet);
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
            }
            //person search
            else {
                const user = { search: { firstName: topic, lastName: topic, userName: topic } };
                const { results } = await simulateRequestOverKafka("getUsers", user);
                return res.json(results);
            }
        } else {
            return res.status(400).json({ message: "Bad Request" });
        }
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});

//create a new tweet
router.post('/', upload.single('tweetImage'), requireAuth, async function (req, res, next) {
    const { tweet } = req.body;
    const tweetImage = req.file ? `/${req.file.filename}` : '';
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    try {
        const user = req.user;
        const tweetDoc = {
            tweetID: uuidv4(),
            tweetDate: (curr_year + '-' + curr_month + '-' + curr_date + ' ' + hour + ':' + minutes + ':' + seconds),
            tweetOwnerID: user.userID,
            viewCount: 0,
            tweet, tweetImage,
        };
        const results = await simulateRequestOverKafka("saveTweet", tweetDoc);
        res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }

});
//Delete a owned tweet
router.post('/delete', requireAuth, async function (req, res, next) {
    const { tweetID } = req.body;
    try {
        const loggedInUser = req.user;
        const tweet = {
            tweetID
        };
        let results = await simulateRequestOverKafka("getTweets", tweet);
        if (results.length > 0) {
            if (results[0].tweetOwnerID == loggedInUser.userID) {
                await simulateRequestOverKafka("deleteTweet", tweet);
                res.json({ message: "Tweet Deleted" });
            }
        }
        else return res.status(400).json({ message: "Unauthorised" });
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});

// Get all tweets for all the followed users
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
            "user": {
                "userID": "062F71CC-EEDB-C475-0475-0007347D2915",
                "email": "ipsum@loremac.ca",
                "firstName": "Noah",
                "lastName": "Whitfield",
                "city": "Saltillo",
                "state": "Coa",
                "zipcode": "6193",
                "profileDesc": null,
                "userName": "Branden",
                "profileImage": null,
                "isActive": 1,
                "DOB": "2020-06-20T07:00:00.000Z"
            },
            "likeCount": 2,
            "replyCount": 0,
            "retweetCount": 2
        }
    ]
*/
router.get('/tweets', requireAuth, async function (req, res, next) {
    try {
        //get the userID s of followed persons from table follower
        let { results } = await simulateRequestOverKafka("getFollowedUsers", req.user);
        if (results.length > 0) {
            const followedUsers = JSON.parse(JSON.stringify(results));
            const followedUserIds = followedUsers.map(f => f.followedID);
            //add tweets authored by logged in user as well
            followedUserIds.push(req.user.userID);

            // get all tweets from all followed users
            results = await simulateRequestOverKafka("getTweets", { tweetOwnerID: { $in: followedUserIds } });
            const allTweetIds = results.map(t => t.tweetID);

            // get all users, likeCount, retweetCount and replyCount in parallel
            const [{ results: allFollowedUsers }, likeCounts, retweetCounts, replyCounts] = await Promise.all([
                simulateRequestOverKafka("getUsers", { userID: followedUserIds }),
                simulateRequestOverKafka("getLikeCount", allTweetIds),
                simulateRequestOverKafka("getRetweetCount", allTweetIds),
                simulateRequestOverKafka("getReplyCount", allTweetIds)
            ]);

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
            results = results.map(res => ({
                tweet: res,
                user: followedUsersMap[res.tweetOwnerID],
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
//like a tweet
router.put('/like', requireAuth, async function (req, res, next) {
    const { tweetID } = req.body;
    try {
        const user = req.user;
        const like = {
            tweetID,
            userID: user.userID
        };
        await simulateRequestOverKafka("saveLike", like);
        res.json({ message: "Tweet Liked" });

    } catch (e) {
        res.status(500).send(e.message || e);
    }

});
//unlike a tweet
router.put('/unlike', requireAuth, async function (req, res, next) {
    try {
        const { tweetID } = req.body;
        if (tweetID) {
            const user = req.user;
            const like = {
                tweetID,
                userID: user.userID
            };
            await simulateRequestOverKafka("delLike", like);
            res.json({ message: "Tweet unliked" });
        }
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//retweet a tweet
router.post('/retweet', requireAuth, async function (req, res, next) {
    const { retweet, tweetID } = req.body;
    const retweetImage = req.file ? `/${req.file.filename}` : '';

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    try {
        const loggedInUser = req.user;
        const retweetDoc = {
            retweetID: uuidv4(),
            retweet, tweetID,
            retweetDate: (curr_year + '-' + curr_month + '-' + curr_date + ' ' + hour + ':' + minutes + ':' + seconds),
            retweetOwnerID: loggedInUser.userID,
            retweetImage
        }
        const results = await simulateRequestOverKafka("saveRetweet", retweetDoc);
        res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
//reply to a tweet
router.post('/reply', requireAuth, async function (req, res, next) {
    const { reply, tweetID } = req.body;
    const replyImage = req.file ? `/${req.file.filename}` : '';

    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1;
    var curr_year = d.getFullYear();
    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    try {
        const loggedInUser = req.user;
        const replyDoc = {
            replyID: uuidv4(),
            reply, tweetID,
            replyDate: (curr_year + '-' + curr_month + '-' + curr_date + ' ' + hour + ':' + minutes + ':' + seconds),
            replyOwnerID: loggedInUser.userID,
            replyImage
        }
        const results = await simulateRequestOverKafka("saveReply", replyDoc);
        res.json(results);
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
module.exports = router;