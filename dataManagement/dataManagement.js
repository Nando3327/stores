const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sa',
    password: 'efestor2411'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = {

    getUserPlaces: function (user, alias) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE SECURITY.users ' +
                'SET Alias = ? ' +
                'WHERE UserKey = ?';
            connection.query(query, [alias, user], (err, res) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    getUserCountries: function (user) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE SECURITY.users ' +
                'SET Alias = ? ' +
                'WHERE UserKey = ?';
            connection.query(query, [user], (err, res) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    getUserLocationDetail: function (user, location) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE SECURITY.users ' +
                'SET Alias = ? ' +
                'WHERE UserKey = ?';
            connection.query(query, [location, user], (err, res) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    }
};
