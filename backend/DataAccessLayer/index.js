const mysql = require('mysql');

const { sql_host, sql_port, sql_user, sql_password, sql_database, sql_connectionLimit } = require('../config');
const { getUsers, saveUsers, editUser, deleteUser } = require('./users');

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

module.exports = {
    getUsers: _getUsers,
    saveUsers: _saveUsers,
    editUser: _editUser,
    deleteUser: _deleteUser,
};