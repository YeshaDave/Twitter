"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema(
  {
   listID:String,
   listName :String,
   ownerID:String,
   subscribers:Array,
   members:Array,
   isPrivate:Number,
   listDesc:String
  },
  { timestamps: true } // Will also give the List Created datetime
);

const lists = mongoose.model("lists", ListSchema, "lists");
module.exports = { lists, ListSchema };
