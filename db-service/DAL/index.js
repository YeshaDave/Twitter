const mysql = require("mysql");
const mongoose = require("mongoose");

const {
  sql_host,
  sql_port,
  sql_user,
  sql_password,
  sql_database,
  sql_connectionLimit
} = require("../config");
const {
  mongo_host,
  mongo_user,
  mongo_password,
  mongo_database,
  mongo_connectionLimit,
  mongo_port
} = require("../config");

const { getUsers, saveUsers, editUser, deleteUser } = require("./users");
const { getTweets, saveTweet, deleteTweet, editTweet } = require("./tweets");
const {
  getLists,
  saveLists,
  getMemberships,
  getSubscriptions,
  getMembers,
  getSubscribers,
  setSubscribers,
  setMembers,
  unsetSubscribers,
  unsetMembers,
  deleteList
} = require("./lists");
const {
  getFollowedUsers,
  getFollowers,
  saveFollower,
  deleteFollower
} = require("./follower");

const { getLike, saveLike, getLikeCount, delLike } = require("./like");
const { getRetweet, saveRetweet, getRetweetCount } = require('./retweet');
const { getReply, saveReply, getReplyCount } = require('./reply');

const { setBookmarks, getBookmarks, deleteBookmarks } = require('./bookmarks')

const {
  getTweetViewCount,
  getTweetLikeCount,
  getARetweetCount,
  getTweetCountHour,
  getTweetCountDay,
  getTweetCountMonth,
  getProfileViewCount,
  IncTweetViewCount,
  IncProfileViewCount
} = require("./analytics")

const { getMessages, sendMessages, deleteMessages, getOwnMessages } = require("./messages");

const options = {
  connectionLimit: sql_connectionLimit,
  host: sql_host,
  port: sql_port,
  user: sql_user,
  password: sql_password,
  database: sql_database,
  multipleStatements: true
};
const pool = mysql.createPool(options);

//Create MySQL connection
const getSQLConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      return err ? reject(err) : resolve(connection);
    });
  });
};

//Set up default mongoose connection
const getMongoConnection = () => {
  return new Promise(async (resolve, reject) => {
    const mongoDB = `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_host}:${mongo_port}/${mongo_database}`;
    try {
      await mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true,
        poolSize: 1,
        
      });
    } catch (e) {
      console.log(e);
      return reject(e);
    }
    return resolve();
  });
};
const _getUsers = async whereClause => {
  const connection = await getSQLConnection();
  return getUsers(connection)(whereClause);
};

const _saveUsers = async whereClause => {
  const connection = await getSQLConnection();
  return saveUsers(connection)(whereClause);
};

const _editUser = async whereClause => {
  const connection = await getSQLConnection();
  return editUser(connection)(whereClause);
};

const _deleteUser = async whereClause => {
  const connection = await getSQLConnection();
  return deleteUser(connection)(whereClause);
};

const _getFollowedUsers = async whereClause => {
  const connection = await getSQLConnection();
  return getFollowedUsers(connection)(whereClause);
};

const _getFollowers = async whereClause => {
  const connection = await getSQLConnection();
  return getFollowers(connection)(whereClause);
};

const _saveFollower = async whereClause => {
  const connection = await getSQLConnection();
  return saveFollower(connection)(whereClause);
};

const _deleteFollower = async whereClause => {
  const connection = await getSQLConnection();
  return deleteFollower(connection)(whereClause);
};

const _getTweets = async whereClause => {
  await getMongoConnection();
  return getTweets()(whereClause);
};

const _saveTweet = async whereClause => {
  await getMongoConnection();
  return saveTweet()(whereClause);
};

const _deleteTweet = async whereClause => {
  await getMongoConnection();
  return deleteTweet()(whereClause);
};

const _editTweet = async whereClause => {
  await getMongoConnection();
  return editTweet()(whereClause);
};
const _getRetweet = async whereClause => {
  await getMongoConnection();
  return getRetweet()(whereClause);
};
const _saveRetweet = async whereClause => {
  await getMongoConnection();
  return saveRetweet()(whereClause);
};
const _getRetweetCount = async tweetIds => {
  await getMongoConnection();
  return getRetweetCount()(tweetIds);
};
const _getLike = async whereClause => {
  await getMongoConnection();
  return getLike()(whereClause);
};
const _saveLike = async whereClause => {
  await getMongoConnection();
  return saveLike()(whereClause);
};
const _delLike = async whereClause => {
  await getMongoConnection();
  return delLike()(whereClause);
};
const _getLikeCount = async tweetIds => {
  await getMongoConnection();
  return getLikeCount()(tweetIds)
};
const _getReply = async whereClause => {
  await getMongoConnection();
  return getReply()(whereClause);
};
const _saveReply = async whereClause => {
  await getMongoConnection();
  return saveReply()(whereClause);
};
const _getReplyCount = async tweetIds => {
  await getMongoConnection();
  return getReplyCount()(tweetIds)
};
const _getLists = async whereClause => {
  await getMongoConnection();
  return getLists()(whereClause);
};

const _saveLists = async whereClause => {
  await getMongoConnection();
  return saveLists()(whereClause);
};

const _getMemberships = async whereClause => {
  await getMongoConnection();
  return getMemberships()(whereClause);
};

const _getSubscriptions = async whereClause => {
  await getMongoConnection();
  return getSubscriptions()(whereClause);
};

const _getMembers = async whereClause => {
  await getMongoConnection();
  return getMembers()(whereClause);
};

const _getSubscribers = async whereClause => {
  await getMongoConnection();
  return getSubscribers()(whereClause);
};

const _setSubscribers = async whereClause => {
  await getMongoConnection();
  return setSubscribers()(whereClause);
};

const _setMembers = async whereClause => {
  await getMongoConnection();
  return setMembers()(whereClause);
};

const _unsetSubscribers = async whereClause => {
  await getMongoConnection();
  return unsetSubscribers()(whereClause);
};

const _unsetMembers = async whereClause => {
  await getMongoConnection();
  return unsetMembers()(whereClause);
};

const _deleteList = async whereClause => {
  await getMongoConnection();
  return deleteList()(whereClause);
};

const _getBookmarks = async whereClause => {
  await getMongoConnection();
  return getBookmarks()(whereClause);
};

const _setBookmarks = async whereClause => {
  await getMongoConnection();
  return setBookmarks()(whereClause);
};

const _deleteBookmarks = async whereClause => {
  await getMongoConnection();
  return deleteBookmarks()(whereClause);
};

const _getTweetViewCount = async whereClause => {
  await getMongoConnection();
  return getTweetViewCount()(whereClause);
};

const _getTweetLikeCount = async whereClause => {
  await getMongoConnection();
  return getTweetLikeCount()(whereClause);
};

const _getARetweetCount = async whereClause => {
  await getMongoConnection();
  return getARetweetCount()(whereClause);
};
const _getTweetCountHour = async whereClause => {
  await getMongoConnection();
  return getTweetCountHour()(whereClause);
};

const _getTweetCountDay = async whereClause => {
  await getMongoConnection();
  return getTweetCountDay()(whereClause);
};
const _getTweetCountMonth = async whereClause => {
  await getMongoConnection();
  return getTweetCountMonth()(whereClause);
};

const _getProfileViewCount = async whereClause => {
  await getMongoConnection();
  return getProfileViewCount()(whereClause);
};
const _IncTweetViewCount = async whereClause => {
  await getMongoConnection();
  return IncTweetViewCount()(whereClause);
};
const _IncProfileViewCount = async whereClause => {
  await getMongoConnection();
  return IncProfileViewCount()(whereClause);
};

const _getMessages = async whereClause => {
  await getMongoConnection();
  return getMessages()(whereClause);
};
const _getOwnMessages = async whereClause => {
  await getMongoConnection();
  return getOwnMessages()(whereClause);
};

const _sendMessages = async whereClause => {
  await getMongoConnection();
  return sendMessages()(whereClause);
};

const _deleteMessages = async whereClause => {
  await getMongoConnection();
  return deleteMessages()(whereClause);
};

module.exports = {
  getUsers: _getUsers,
  saveUsers: _saveUsers,
  editUser: _editUser,
  deleteUser: _deleteUser,

  getFollowedUsers: _getFollowedUsers,
  saveFollower: _saveFollower,
  getFollowers: _getFollowers,
  deleteFollower: _deleteFollower,

  getTweets: _getTweets,
  saveTweet: _saveTweet,
  deleteTweet: _deleteTweet,
  editTweet: _editTweet,

  getRetweet: _getRetweet,
  saveRetweet: _saveRetweet,
  getRetweetCount: _getRetweetCount,

  getLike: _getLike,
  delLike: _delLike,
  saveLike: _saveLike,
  getLikeCount: _getLikeCount,

  getReply: _getReply,
  saveReply: _saveReply,
  getReplyCount: _getReplyCount,

  getLists: _getLists,
  saveLists: _saveLists,
  getMemberships: _getMemberships,
  getSubscriptions: _getSubscriptions,
  getMembers: _getMembers,
  getSubscribers: _getSubscribers,
  setSubscribers: _setSubscribers,
  setMembers: _setMembers,
  unsetSubscribers: _unsetSubscribers,
  unsetMembers: _unsetMembers,
  deleteList: _deleteList,

  getMongoConnection,

  getBookmarks: _getBookmarks,
  setBookmarks: _setBookmarks,
  deleteBookmarks: _deleteBookmarks,

  getTweetViewCount: _getTweetViewCount,
  getTweetLikeCount: _getTweetLikeCount,
  getARetweetCount: _getARetweetCount,
  getTweetCountHour: _getTweetCountHour,
  getTweetCountDay: _getTweetCountDay,
  getTweetCountMonth: _getTweetCountMonth,

  getProfileViewCount: _getProfileViewCount,

  IncTweetViewCount: _IncTweetViewCount,
  IncProfileViewCount: _IncProfileViewCount,

  getMessages: _getMessages,
  getOwnMessages: _getOwnMessages,
  sendMessages: _sendMessages,
  deleteMessages: _deleteMessages,
};
