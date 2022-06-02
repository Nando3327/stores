const mysql = require('mysql');
const config = require('../configs/connection.json');
const connection = mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.name,
    password: config.password
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});
const tag = 'STORES DM'

module.exports = {

    getZones: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT Z.Id as id, Z.Name as name ' +
                    'FROM Stores.zones Z ' +
                    'INNER JOIN Stores.userzones UZ ON Z.Id = UZ.Zone ' +
                    'WHERE UZ.UserKey = ?';
                connection.query(query, [user], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
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

    getAllZones: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT Z.Id as id, Z.Name as name ' +
                    'FROM Stores.zones Z';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
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
                    'FROM Stores.businesstypes BT ' +
                    'WHERE BT.Visible = 1 ';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
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

    updateBusinessType: function (id, type) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Stores.businesstypes ' +
                'SET Type = ? ' +
                'WHERE Id = ? ';
            connection.query(query, [type, id], (err, res) => {
                if (err) {
                    console.log(tag, err);
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    visibleBusinessType: function (id, status) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Stores.businesstypes ' +
                'SET Visible = ? ' +
                'WHERE Id = ? ';
            connection.query(query, [status, id], (err, res) => {
                if (err) {
                    console.log(tag, err);
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    addBusinessType: function (type) {
        return new Promise((resolve, reject) => {
            const businessType = {Type: type}
            connection.query('INSERT Stores.businesstypes ' +
                ' SET ?', businessType,
                (err, res) => {
                    if (err) {
                        console.log(tag, err);
                        reject('SQL ERROR');
                        return;
                    }
                    resolve(res);
                });
        });
    },

    getHangerTypes: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT HT.Id as id, HT.Type as value ' +
                    'FROM Stores.hangertypes HT ' +
                    'WHERE HT.Visible = 1 ';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
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

    updateHangerType: function (id, type) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Stores.hangertypes ' +
                'SET Type = ? ' +
                'WHERE Id = ? ';
            connection.query(query, [type, id], (err, res) => {
                if (err) {
                    console.log(tag, err);
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    visibleHangerType: function (id, status) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Stores.hangertypes ' +
                'SET Visible = ? ' +
                'WHERE Id = ? ';
            connection.query(query, [status, id], (err, res) => {
                if (err) {
                    console.log(tag, err);
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    addHangerType: function (type) {
        return new Promise((resolve, reject) => {
            const businessType = {Type: type}
            connection.query('INSERT Stores.hangertypes ' +
                ' SET ?', businessType,
                (err, res) => {
                    if (err) {
                        console.log(tag, err);
                        reject('SQL ERROR');
                        return;
                    }
                    resolve(res);
                });
        });
    },

    getStatus: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT S.Id as id, S.Status as value ' +
                    'FROM Stores.status S ';
                connection.query(query, [], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
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
                connection.query('INSERT Stores.stores SET ?', store, (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    saveStoreUser: function (storeId, userKey) {
        return new Promise((resolve, reject) => {
            try {
                const store = {
                    UserKey: userKey,
                    Store: storeId
                }
                connection.query('INSERT Stores.userstore SET ?', store, (err, res) => {
                    if (err) {
                        console.log(tag, err);
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
                const query = 'UPDATE Stores.stores ' +
                    'SET Lat = ?, Lon = ?, Name = ?, ' +
                    'ZoneId = ?, Description = ?, Image = ?, ' +
                    'BusinessTypeId = ?, HangerTypeId = ?, Ruc = ?, StatusId = ? ' +
                    'WHERE Location = ?';
                connection.query(query, [store.Lat, store.Lon, store.Name,
                    store.ZoneId, store.Description, store.Image,
                    store.BusinessTypeId, store.HangerTypeId, store.Ruc, store.StatusId, store.Location], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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
                connection.query('INSERT Stores.storehistorical SET ?', storeHistorical, (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    addAddress: function (addressStores) {
        return new Promise((resolve, reject) => {
            try {
                connection.query('INSERT Stores.address (Categorie, Value, LocationId, Type) VALUES ?', [addressStores.map(address => [address.Categorie, address.Value, address.LocationId, address.Type])], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    deleteAddressByLocationId: function (locationId) {
        return new Promise((resolve, reject) => {
            try {
                connection.query('DELETE FROM Stores.address WHERE LocationId = ?', [locationId], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    getAuthorizer: function (source, method) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT mt.value as method, au.value as authorized ' +
                'FROM switch.authorizers au INNER JOIN switch.methods mt ON au.source = mt.source ' +
                'WHERE mt.methodName = ? and au.source = ?; ';
            connection.query(query, [method, source], (err, rows) => {
                if (err) {
                    console.log(tag, err);
                    reject('SQL ERROR');
                    return;
                }
                resolve((rows && rows.length > 0) ? rows[0] : undefined);
            });
        });
    },

    getAllStores: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT sh.Date, s.Location as location, s.Lat as lat, s.Lon as lon, s.Name as name, s.Description as description, s.Image as image, s.Ruc as ruc, ' +
                    'st.Id as statusId, st.Status as status, st.Marker as marker, st.ClassStyle as classStyle, st.ShowDateField as showDate, sh.DateToShow as historicalDate, ' +
                    'z.Id as zoneId, b.Id as businessTypeId, b.Type as businessType, h.Id as hangerTypeId, h.Type as hangerType, ' +
                    'a.Type as addressType, a.Value as address, a.Id as addressId, a.Categorie as addressCategorie, ' +
                    'sh.LocationId as locationMarker, sh.StatusId as statusHistorical, sh.DateToShow as date, sh.LocationId as locationMarker, ' +
                    'sh.Id as historicalId, sh.SellValue as sellValue, sth.ClassStyle as historicalClassStyle, sth.ShowHistorical as showHistorical, sth.ShowDateField as showDateField ' +
                    'FROM Stores.stores s ' +
                    'INNER JOIN Stores.storehistorical sh on s.Location = sh.LocationId ' +
                    'INNER JOIN Stores.address a on s.Location = a.LocationId ' +
                    'INNER JOIN Stores.status st on s.StatusId = st.Id ' +
                    'INNER JOIN Stores.businesstypes b on s.BusinessTypeId = b.Id ' +
                    'INNER JOIN Stores.hangertypes h on s.HangerTypeId = h.Id ' +
                    'INNER JOIN Stores.zones z on s.ZoneId = z.Id ' +
                    'INNER JOIN Stores.userzones UZ ON z.Id = UZ.Zone ' +
                    'INNER JOIN Stores.status sth on sth.Id = sh.StatusId ' +
                    'WHERE a.Categorie = "PR" and UZ.UserKey = ? ' +
                    'ORDER BY sh.Date desc';
                connection.query(query, [user], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
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

    changeStoreStatus: function (locationId, statusId) {
        return new Promise((resolve, reject) => {
            try {
                connection.query('UPDATE Stores.stores SET StatusId = ? WHERE Location = ?', [statusId, locationId], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    getStoresByStatus: function (statusId) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT s.Location as location, s.Lat as lat, s.Lon as lon, ' +
                    's.Name as name, s.Description as description, s.Image as image, s.Ruc as ruc ' +
                    'FROM Stores.stores s ' +
                    'WHERE s.StatusId = ? ';
                connection.query(query, [statusId], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : []);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getStoresByUser: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT S.Store as id ' +
                    'FROM Stores.userstore S ' +
                    'WHERE S.UserKey = ? ';
                connection.query(query, [user], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : []);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserRol: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT U.Roll as roll ' +
                    'FROM security.users U ' +
                    'WHERE U.UserKey = ? ';
                connection.query(query, [user], (err, rows) => {
                    if (err) {
                        console.log(tag, err);
                        reject('SQL ERROR');
                        return;
                    }
                    resolve((rows && rows.length > 0) ? rows : []);
                });
            } catch (e) {
                console.log(e);
                resolve(e);
            }
        });
    },

    getUserZones: function (user) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT UZ.Id as id, UZ.Zone as zone, Z.Name as name ' +
                    'FROM Stores.userzones UZ ' +
                    'INNER JOIN Stores.zones Z on UZ.Zone = Z.Id ' +
                    'WHERE UZ.UserKey = ?';
                connection.query(query, [user], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    getUserZonesStore: function (user, zone) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT id, S.Location as location, S.Name as name ' +
                    'FROM Stores.userstore US ' +
                    'INNER JOIN Stores.stores S on US.Store = S.Location ' +
                    'WHERE S.ZoneId = ? and US.UserKey = ?';
                connection.query(query, [zone, user], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

    getZonesStore: function (zone) {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT S.Location as location, S.Name as name ' +
                    'FROM Stores.stores S ' +
                    'WHERE S.ZoneId = ? ';
                connection.query(query, [zone], (err, res) => {
                    if (err) {
                        console.log(tag, err);
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

};
