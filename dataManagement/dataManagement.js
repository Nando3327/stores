const md5 = require('md5');
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
    getData: function () {
        const axios = require('axios');
        const cheerio = require('cheerio');
        const url = 'https://news.ycombinator.com/';
        return axios(url)
            .then(response => {
                return cheerio.load(response.data);
            })
            .catch(console.error);
    },

    getUserData: function (data) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT U.Name, U.LastName, U.UserKey, U.Alias, A.Value as Email, U.ChangePassword, UP.profile as profileId, UP.principal, P.name as profileName ' +
                    'FROM SECURITY.users U ' +
                    'INNER JOIN SECURITY.address A ON U.UserKey = A.UserKey ' +
                    'INNER JOIN SECURITY.user_profile UP ON U.UserKey = UP.user ' +
                    'INNER JOIN SECURITY.profiles P ON P.id = UP.profile ' +
                    'WHERE (U.UserKey = ? or A.value = ? or U.Alias = ? ) and Password = ? and A.Categorie = "PR" and A.Type = "EM" and P.active = 1';
                connection.query(query, [data.name, data.name, data.name, md5(data.password)], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    if (rows && rows.length > 0) {
                        const returnObj = {
                            Name: rows[0].Name,
                            LastName: rows[0].LastName,
                            Alias: rows[0].Alias,
                            UserKey: rows[0].UserKey,
                            Email: rows[0].Email,
                            ChangePassword: rows[0].ChangePassword,
                            profiles: []
                        };
                        rows.forEach(r => {
                            returnObj.profiles.push({
                                id: r.profileId,
                                name: r.profileName,
                                principal: r.principal
                            })
                        });
                        resolve(returnObj);
                    } else {
                        resolve(undefined);
                    }
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserTransactions: function (userKey, profile) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT A.code as appCode, A.name as appName, A.icon as appIcon, M.code as modCode, M.name as modName, M.icon as modIcon, T.code as trCode, T.name as trName, T.icon as trIcon, T.link as trLink, P.name as profileName, P.id as profileId ' +
                    'FROM SECURITY.aplications A' +
                    '  INNER JOIN SECURITY.modules M ON A.code = M.aplication' +
                    '  INNER JOIN SECURITY.transactions T ON T.modules = M.code' +
                    '  INNER JOIN SECURITY.profile_transaction PT ON PT.transaction = T.code' +
                    '  INNER JOIN SECURITY.profiles P on PT.profile =  P.id' +
                    '  INNER JOIN SECURITY.user_profile UP ON UP.profile = P.id ' +
                    'WHERE UP.user = ? AND P.id = ? AND A.active = 1 AND M.active = 1 AND T.active = 1 AND PT.active = 1 AND P.active = 1';
                connection.query(query, [userKey, profile], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    if (rows && rows.length > 0) {
                        const apps = [...new Set(rows.map(item => item.appCode))];
                        const response = {
                            app: [],
                            profile: profile
                        };
                        apps.forEach(a => {
                            const appsRows = rows.find(ap => {
                                return ap.appCode === a
                            });
                            if (appsRows) {
                                response.app.push({
                                    code: appsRows.appCode,
                                    name: appsRows.appName,
                                    icon: appsRows.appIcon,
                                    modules: []
                                })
                            }
                        });
                        response.app.forEach(a => {
                            const appsRows = rows.filter(ap => {
                                return ap.appCode === a.code
                            });
                            const modules = [...new Set(appsRows.map(item => item.modCode))];
                            modules.forEach(m => {
                                const moduleRows = rows.find(mo => {
                                    return mo.modCode === m
                                });
                                a.modules.push({
                                    code: moduleRows.modCode,
                                    name: moduleRows.modName,
                                    icon: moduleRows.modIcon,
                                    transactions: []
                                })
                            });
                        });
                        response.app.forEach(a => {
                            a.modules.forEach(m => {
                                const modulesRows = rows.filter(ap => {
                                    return ap.modCode === m.code
                                });
                                const transactions = [...new Set(modulesRows.map(item => item.trCode))];
                                transactions.forEach(t => {
                                    const transactionRows = rows.find(tr => {
                                        return tr.trCode === t
                                    });
                                    m.transactions.push({
                                        code: transactionRows.trCode,
                                        name: transactionRows.trName,
                                        icon: transactionRows.trIcon,
                                        link: transactionRows.trLink
                                    })
                                });
                            });
                        });
                        resolve(response);
                    } else {
                        resolve(undefined);
                    }
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserDataByEmail: function (email) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT Name, LastName, U.UserKey, Alias, A.Value as Email, ChangePassword ' +
                    'FROM SECURITY.users U INNER JOIN SECURITY.address A ON U.UserKey = A.UserKey ' +
                    'WHERE A.Value = ? and A.Categorie = "PR" and A.Type = "EM"';
                connection.query(query, [email], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows[0] : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    registerUser: function (data, mail) {
        return new Promise((resolve, reject) => {
            try {
                const user = {
                    UserKey: data.userKey,
                    Name: data.name,
                    LastName: data.lastname,
                    Password: md5(data.password),
                    Alias: data.alias,
                    ChangePassword: 0
                };
                connection.query('INSERT SECURITY.users SET ?', user, (err, res) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    const address = {
                        UserKey: data.userKey,
                        Type: 'EM',
                        Value: mail,
                        Categorie: 'PR'
                    };
                    connection.query('INSERT SECURITY.address SET ?', address, (err, res) => {
                        if (err) {
                            reject('SQL ERROR');
                            return;
                        }
                        const query = 'SELECT id ' +
                            'FROM SECURITY.profiles ' +
                            'WHERE defaultProfile = 1 and type = "P"';
                        connection.query(query, (err, rows) => {
                            if (err) {
                                reject('SQL ERROR');
                                return;
                            }
                            const userProfile = {
                                profile: rows[0].id,
                                user: data.userKey,
                                principal: 1
                            };
                            connection.query('INSERT SECURITY.user_profile SET ?', userProfile, (err, res) => {
                                if (err) {
                                    reject('SQL ERROR');
                                    return;
                                }
                                resolve(res);
                            });
                        });
                    });
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    },

    validateExistAlias: function (alias) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT alias ' +
                'FROM SECURITY.users ' +
                'WHERE userkey = ? or alias = ?';
            connection.query(query, [alias, alias], (err, rows) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve((rows && rows.length > 0));
            });
        });
    },

    validateExistEmailAddres: function (mail) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT value ' +
                'FROM SECURITY.address ' +
                'WHERE value = ? ';
            connection.query(query, [mail], (err, rows) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve((rows && rows.length > 0));
            });
        });
    },

    getAuthorizer: function (source, method) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT mt.value as method, au.value as authorized ' +
                'FROM SWITCH.authorizers au INNER JOIN SWITCH.methods mt ON au.source = mt.source ' +
                'WHERE mt.methodName = ? and au.source = ?; ';
            connection.query(query, [method, source], (err, rows) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve((rows && rows.length > 0) ? rows[0] : undefined);
            });
        });
    },

    updateUserPassword: function (user, password, changePassword = true) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE SECURITY.users ' +
                'SET Password = ?, ChangePassword = ? ' +
                'WHERE UserKey = ?';
            connection.query(query, [md5(password), changePassword, user.UserKey], (err, res) => {
                if (err) {
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    updateUserAlias: function (user, alias) {
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
    }
};
