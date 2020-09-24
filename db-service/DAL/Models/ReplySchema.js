"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReplySchema = new Schema(
    {
        tweetID: { type: String, required: true },
        replyID: { type: String, required: true, index: true, unique: true },
        reply: { type: String, maxlength: 280 },
        replyOwnerID: { type: String, required: true, index: true },
        replyImage: String,
        replyDate: Date,
    }
);
const replies = mongoose.model("replies", ReplySchema, "replies");
module.exports = { replies, ReplySchema };
