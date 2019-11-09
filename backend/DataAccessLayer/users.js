const tableName = 'Users';

const getUsers = connection => (user = {}) => {
    const { userID, email, password } = user;
    let query = `select * from ${tableName}`;
    const clause = [];
    if (userID) {
        clause.push(`userID='${userID}'`);
    }
    if (email) {
        clause.push(`email='${email}'`);
    }
    if (password) {
        clause.push(`password='${password}'`);
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
const saveUsers = connection => (user) => {
    const { userID, email, password, firstName, lastName, isActive } = user;
    let query = `insert into ${tableName} (userID, email, password, firstName, lastName, isActive)` +
        ` VALUES ('${userID}', '${email}', '${password}', '${firstName}', '${lastName}', ${isActive});`;
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
    getUsers,
    saveUsers
};
