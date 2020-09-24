const { bookmarks } = require("./Models/BookmarkSchema");

const getBookmarks= connection => (bookmark = {}) => {
  return new Promise((resolve, reject) => {
    bookmarks.find(bookmark, function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const setBookmarks = connection => bookmark => {
  let bookmarkRec = new bookmarks(bookmark);
  return new Promise((resolve, reject) => {
    bookmarkRec.save(function(err, docs) {
      return err ? reject(err) : resolve(docs);
    });
  });
};

const deleteBookmarks = connection => (bookmark = {}) => {
    return new Promise((resolve, reject) => {
      bookmarks.remove(bookmark, function(err, docs) {
        return err ? reject(err) : resolve(docs);
      });
    });
  };
  
  module.exports = {
    getBookmarks,
    setBookmarks,
    deleteBookmarks,
   
  };
  