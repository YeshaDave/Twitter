"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema(
  {
    userID: String,
    tweetID: String
  },
  { timestamps: true }
);

const bookmarks = mongoose.model("bookmarks", BookmarkSchema, "bookmarks");
module.exports = { bookmarks, BookmarkSchema };
