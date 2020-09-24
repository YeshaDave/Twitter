"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LikeSchema = new Schema(
    {
        tweetID: { type: String, required: true },
        userID: { type: String, required: true }
    }
);
const likes = mongoose.model("likes", LikeSchema, "likes");
module.exports = { likes, LikeSchema };