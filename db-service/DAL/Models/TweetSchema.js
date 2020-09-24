"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    tweetID: { type: String, required: true, index: true, unique: true },
    tweet: { type: String, maxlength: 280 },
    tweetImage: String,
    tweetOwnerID: { type: String, required: true, index: true },
    // likeCount: { type: Number, min: 0 },
    tweetDate: Date,
    viewCount: { type: Number, min: 0 },
    listID: String
});
TweetSchema.index({ tweet: "text" });

const tweets = mongoose.model("tweets", TweetSchema, "tweets");
module.exports = { tweets, TweetSchema };