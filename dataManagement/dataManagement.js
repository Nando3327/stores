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

    getZones: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT Z.Id as id, Z.Name as name ' +
                    'FROM STORES.zones Z ';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getBusinessTypes: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT BT.Id as id, BT.Type as value ' +
                    'FROM STORES.businesstypes BT ';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getHangerTypes: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT HT.Id as id, HT.Type as value ' +
                    'FROM STORES.hangertypes HT ';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    saveNewStore: function (store) {
        return new Promise((resolve, reject) => {
            try {
                connection.query('INSERT STORES.stores SET ?', store, (err, res) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve(res);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    updateStore: function (store) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'UPDATE STORES.stores ' +
                    'SET Lat = ?, Lon = ?, Name = ?, ' +
                    'ZoneId = ?, Description = ?, Image = ?, ' +
                    'BusinessTypeId = ?, HangerTypeId = ?, Ruc = ? ' +
                    'WHERE Location = ?';
                connection.query(query, [store.Lat, store.Lon, store.Name,
                    store.ZoneId, store.Description, store.Image,
                    store.BusinessTypeId, store.HangerTypeId, store.Ruc, store.Location], (err, res) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve(res);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    addStoreHistorical: function (storeHistorical) {
        return new Promise((resolve, reject) => {
            try {
                connection.query('INSERT STORES.storehistorical SET ?', storeHistorical, (err, res) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve(res);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },






    getUserPlaces: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT L.Id as location, L.Latitude as lat, L.Longitude as lon, ' +
                    'L.Name as name, L.Description as description, L.Image as image, LU.Visited as visited ' +
                    'FROM PLACES.location L ' +
                    'INNER JOIN PLACES.location_user LU ON L.Id = LU.LocationKey ' +
                    'WHERE LU.UserKey = ? ';
                connection.query(query, [user], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserPlacesCountry: function (user, country) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT L.Id as location, L.Latitude as lat, L.Longitude as lon, ' +
                    'L.Name as name, L.Description as description, L.Image as image, LU.Visited as visited ' +
                    'FROM PLACES.countries C ' +
                    'INNER JOIN PLACES.location L ON L.Country = C.Id ' +
                    'INNER JOIN PLACES.location_user LU ON L.Id = LU.LocationKey ' +
                    'WHERE LU.UserKey = ? and C.Id = ? ';
                connection.query(query, [user, country], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserPlacesByVisited: function (user, visited) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT L.Id as location, L.Latitude as lat, L.Longitude as lon, ' +
                    'L.Name as name, L.Description as description, L.Image as image, LU.Visited as visited ' +
                    'FROM PLACES.location L ' +
                    'INNER JOIN PLACES.location_user LU ON L.Id = LU.LocationKey ' +
                    'WHERE LU.UserKey = ? and LU.visited = ? ';
                connection.query(query, [user, visited], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserCountries: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT C.Name as countryName, C.Id as countryId, CU.Favorite as favorite ' +
                    'FROM PLACES.countries C ' +
                    'INNER JOIN PLACES.countries_user CU ON C.Id = CU.Country ' +
                    'WHERE CU.UserKey = ? ';
                connection.query(query, [user], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserLocationDetail: function (user, location) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT LU.Weather as weather, L.Altimetry as altimetry, LU.Date as date ' +
                    'FROM Places.location L ' +
                    'INNER JOIN Places.location_user LU ON L.Id = LU.LocationKey ' +
                    'WHERE LU.UserKey = ? and LU.LocationKey = ? ';
                connection.query(query, [user, location], (err, rows) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : undefined);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    setCountryStatus: function (user, country, favorite) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'UPDATE Places.countries_user ' +
                    'SET Favorite = ? ' +
                    'WHERE UserKey = ? and Country = ?';
                connection.query(query, [favorite, user, country], (err, res) => {
                    if (err) {
                        reject('SQL ERROR');
                        return;
                    }
                    resolve('UPDATE REALIZADO CON EXITO!');
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    }
};
