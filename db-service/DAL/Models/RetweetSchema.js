"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RetweetSchema = new Schema(
    {
        retweetID: { type: String, required: true, index: true, unique: true },
        retweet: { type: String, maxlength: 280 },
        tweetID: { type: String, required: true },
        retweetImage: String,
        retweetDate: Date,
        retweetOwnerID: { type: String, required: true, index: true },
    }
);
const retweets = mongoose.model("retweets", RetweetSchema, "retweets");
module.exports = { retweets, RetweetSchema };