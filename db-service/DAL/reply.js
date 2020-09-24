const { replies } = require('./Models/ReplySchema');
const getReply = connection => (reply = {}) => {
    return new Promise((resolve, reject) => {
        replies.find(reply, function (err, docs) {
            return err ? reject(err) : resolve(docs);
        });
    });
};

const getReplyCount = connection => tweetIds => {
    return new Promise((resolve, reject) => {
        tweetIds = Array.isArray(tweetIds) ? tweetIds : [tweetIds];
        replies.aggregate(
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

const saveReply = connection => (reply) => {
    let replyDoc = new replies(reply);
    return new Promise((resolve, reject) => {
        replyDoc.save(function (err, docs) {
            return err ? reject(err) : resolve(docs);
        })
    });
};

module.exports = {
    getReply,
    saveReply,
    getReplyCount
};