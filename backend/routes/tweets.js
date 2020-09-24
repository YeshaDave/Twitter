var express = require('express');
var router = express.Router();
var passport = require('passport');

const { simulateRequestOverKafka } = require('../KafkaRequestSimulator');

// Set up middleware
var requireAuth = passport.authenticate('jwt', { session: false });

// Get one tweets details
// sample response:
/*
   [
    {
        "tweet": {
            "_id": "5dd43f6d387f5b59a3d20f0c",
            "tweetID": "3bcb631e-c872-4b4b-beb0-db706893914a",
            "tweet": "Minus molestias alias exercitationem excepturi et. #swag #sunset #home #smile #art #instalike ",
            "tweetImage": "",
            "tweetOwnerID": "062F71CC-EEDB-C475-0475-0007347D2915",
            "likeCount": 3,
            "tweetDate": "2019-11-16T20:05:33.187Z",
            "viewCount": 0,
            "listID": "",
            "__v": 0
        },
        "likeCount": 5,
        "replyCount": 0,
        "retweetCount": 4,
        "reply": [],
        "retweet": [
            {
                "_id": "5ddcdd34dbb18c0b382737c4",
                "retweetID": "ac018910-b115-4e98-8d65-07fdc7978a38",
                "retweet": "#retweet spreading the word",
                "tweetID": "3bcb631e-c872-4b4b-beb0-db706893914a",
                "retweetDate": "2019-11-26T08:06:29.000Z",
                "retweetOwnerID": "5317c26d-87fe-4de8-935a-5bc7bad2987a",
                "retweetImage": "",
                "__v": 0
            },
            {
                "_id": "5ddddf83b8b0e804acad6d46",
                "retweetID": "d8ab735e-8ce7-45c8-9648-4f3dcb2da3ac",
                "retweet": "#retweet #important",
                "tweetID": "3bcb631e-c872-4b4b-beb0-db706893914a",
                "retweetDate": "2019-11-27T02:29:20.000Z",
                "retweetOwnerID": "5317c26d-87fe-4de8-935a-5bc7bad2987a",
                "retweetImage": "",
                "__v": 0
            },
            {
                "_id": "5de4d638ef564badc59e4a8a",
                "retweetID": "b13fd987-b3b4-44cf-9cb2-c8922c2bfac3",
                "retweet": "",
                "tweetID": "3bcb631e-c872-4b4b-beb0-db706893914a",
                "retweetDate": "2019-12-02T09:15:36.000Z",
                "retweetOwnerID": "5317c26d-87fe-4de8-935a-5bc7bad2987a",
                "retweetImage": "",
                "__v": 0
            },
            {
                "_id": "5de4d758ef564badc59e4a8d",
                "retweetID": "9a522319-b333-447d-80f6-16f56a12f9f9",
                "retweet": "",
                "tweetID": "3bcb631e-c872-4b4b-beb0-db706893914a",
                "retweetDate": "2019-12-02T09:20:24.000Z",
                "retweetOwnerID": "5317c26d-87fe-4de8-935a-5bc7bad2987a",
                "retweetImage": "",
                "__v": 0
            }
        ]
    }
]
*/
router.get('/details', requireAuth, async function (req, res, next) {
    const { tweetID } = req.query;
    try {
        if (tweetID) {
            // get the tweets details
            let results = await simulateRequestOverKafka("getTweets", { tweetID });
            if (results.length > 0) {
                // get all replies,retweets,likeCount,retweetCount and replyCount in parallel
                const [likeCounts, retweetCounts, retweets, replyCounts, reply, { results: [tweetOwner] }] = await Promise.all([
                    simulateRequestOverKafka("getLikeCount", [tweetID]),
                    simulateRequestOverKafka("getRetweetCount", [tweetID]),
                    simulateRequestOverKafka("getRetweet", { tweetID }),
                    simulateRequestOverKafka("getReplyCount", [tweetID]),
                    simulateRequestOverKafka("getReply", { tweetID }), //tweetOwnerID
                    simulateRequestOverKafka("getUsers", { userID: results[0].tweetOwnerID }),
                ]);
                const replyOwnerIds = reply.map(r => r.replyOwnerID);
                const retweetOwnerIds = retweets.map(r => r.retweetOwnerID);
                const [{ results: repUsersArray }, { results: retweetUsersArray }] = await Promise.all([
                    simulateRequestOverKafka("getUsers", { userID: Array.from(new Set(replyOwnerIds)) }),
                    simulateRequestOverKafka("getUsers", { userID: Array.from(new Set(retweetOwnerIds)) })
                ]);
                const repUsersMap = repUsersArray.reduce((acc, u) => {
                    acc[u.userID] = u;
                    return acc;
                }, {});
                const retweetUsersMap = retweetUsersArray.reduce((acc, u) => {
                    acc[u.userID] = u;
                    return acc;
                }, {});

                // merge all results as so as to produce a response structure something like:
                /*
                    [
                        {
                            tweet: {..tweetObject},
                            reply :{..replyObject},
                            retweet: {..retweetObject},
                            likeCount: 10,
                            replyCount: 10,
                            retweetCount: 10
                        }
                    ]
                */
                results = results.map(res => ({
                    tweet: res,
                    likeCount: likeCounts[res.tweetID],
                    replyCount: replyCounts[res.tweetID],
                    retweetCount: retweetCounts[res.tweetID],
                    replies: reply.map(r => ({ reply: r, user: repUsersMap[r.replyOwnerID] })),
                    retweets: retweets.map(r => ({ retweet: r, user: retweetUsersMap[r.retweetOwnerID] })),
                    tweetOwner
                }));
            }
            return res.json(results);
        }
        else {
            res.status(400).send({ message: "Bad Request" });
        }
    } catch (e) {
        res.status(500).send(e.message || e);
    }
});
module.exports = router;