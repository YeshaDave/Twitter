const tableName = 'Follower';

const getFollowedUsers = connection => (user = {}) => {
    const { userID } = user;
    let query = `select * from ${tableName}`;
    const clause = [];
    if (userID) {
        clause.push(`followerID='${userID}'`);
    }
    query += clause.length > 0 ? ` where ${clause.join(' and ')}` : '';
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release DB connection
            connection.release();
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};
const getFollowers = connection => (user = {}) => {
    const { userID } = user;
    let query = `select * from ${tableName}`;
    const clause = [];
    if (userID) {
        clause.push(`followedID='${userID}'`);
    }
    query += clause.length > 0 ? ` where ${clause.join(' and ')}` : '';
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release DB connection
            connection.release();
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};
const saveFollower = connection => (follow) => {
    const { followerID, followedID } = follow;
    let query = `insert into ${tableName} (followerID, followedID)` +
        ` VALUES ('${followerID}', '${followedID}');`;
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release connection 
            connection.release();
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};
const deleteFollower = connection => (follow) => {
    const { followerID, followedID } = follow;
    let query = `delete from ${tableName}`;
    let clause = [];
    if (followerID) {
        clause.push(`followerID = '${followerID}'`);
    }
    if (followedID) {
        clause.push(`followedID = '${followedID}'`);
    }
    query += clause.length > 0 ? ` where ${clause.join(' and ')}` : ''
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            // release connection 
            connection.release();
            if (error) {
                reject(error);
            } else {
                resolve({ results, fields });
            }
        });
    });
};

module.exports = {
    getFollowedUsers,
    saveFollower,
    deleteFollower,
    getFollowers
};