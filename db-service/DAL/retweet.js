const { retweets } = require('./Models/RetweetSchema');

const getRetweet = connection => (retweet = {}) => {
    return new Promise((resolve, reject) => {
        retweets.find(retweet, function (err, docs) {
            return err ? reject(err) : resolve(docs);
        });
    });
};

const getRetweetCount = connection => tweetIds => {
    return new Promise((resolve, reject) => {
        tweetIds = Array.isArray(tweetIds) ? tweetIds : [tweetIds];
        retweets.aggregate(
            [
                { "$match": { "tweetID": { "$in": tweetIds } } },
                { "$group": { "_id": "$tweetID", "count": { "$sum": 1 } } }
            ],
            (err, docs) => {
                if (err) {
                    return reject(err);
                }
                // return as map something like
                /*
                    {
                        "tweetID1": 2,
                        "tweetID2": 5,
                        ...
                        ...
                    }
                */
                const replyCountMap = tweetIds.reduce((acc, t) => {
                    acc[t] = 0;
                    return acc;
                }, {});
                docs = JSON.parse(JSON.stringify(docs));
                docs.forEach(elem => {
                    replyCountMap[elem._id] = elem.count;
                });
                return resolve(replyCountMap);
            }
        );
    });
};

const saveRetweet = connection => (retweet) => {
    let retweetDoc = new retweets(retweet);
    return new Promise((resolve, reject) => {
        retweetDoc.save(function (err, docs) {
            return err ? reject(err) : resolve(docs);
        })
    });
};

module.exports = {
    getRetweet,
    saveRetweet,
    getRetweetCount
};