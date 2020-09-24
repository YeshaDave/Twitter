"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    senderID: String,
    receiverID: String,
    chat: String,
    chatDate: String
  },
  { timestamps: true }
);

const messages = mongoose.model("messages", MessageSchema, "messages");
module.exports = { messages, MessageSchema };
