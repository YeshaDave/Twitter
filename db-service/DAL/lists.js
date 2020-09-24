const { lists } = require("./Models/ListSchema");
const tableName = "tweets";

const getLists = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.find(list, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const saveLists = connection => list => {
  let listsRec = new lists(list);
  return new Promise((resolve, reject) => {
    listsRec.save(function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const getMemberships = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.find(list, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const getSubscriptions = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.find(list, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const getMembers = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.find(list, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const getSubscribers = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.find(list, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const setSubscribers = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.updateOne(
      { _id: list.listID },
      {
        $push: { subscribers: list.user }
      },
      { upsert: true },
      function(err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};
const setMembers = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    console.log(list.user, list.listID);
    lists.updateOne(
      { _id: list.listID },
      {
        $push: { members: list.user }
      },
      { upsert: true },
      function(err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};
const unsetSubscribers = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.update(
      { _id: list._id },
      { $pull: { subscribers: list.user } },
      function(err, docs) {
        return err ? reject(err) : resolve(docs);
      }
    );
  });
};
const unsetMembers = connection => (list = {}) => {
  return new Promise((resolve, reject) => {
    lists.updateOne({ _id: list._id }, { $pull: { members: list.user } }, function(
      err,
      docs
    ) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const deleteList = connection => (list= {}) => {
  return new Promise((resolve, reject) => {
    lists.remove(list, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

module.exports = {
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
};
