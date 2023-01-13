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
const schemaJson = require('../configs/schema.json')
const schema = schemaJson.schema;

module.exports = {

    getZones: function (user) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'SELECT Z.Id as id, Z.Name as name, UZ.Id as userZoneId ' +
                    'FROM [SCHEMA].zones Z ' +
                    'INNER JOIN [SCHEMA].userzones UZ ON Z.Id = UZ.Zone ' +
                    'WHERE UZ.UserKey = ?';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'SELECT Z.Id as id, Z.Name as name ' +
                    'FROM [SCHEMA].zones Z';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'SELECT BT.Id as id, BT.Type as value ' +
                    'FROM [SCHEMA].businesstypes BT ' +
                    'WHERE BT.Visible = 1 ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
            let query = 'UPDATE [SCHEMA].businesstypes ' +
                'SET Type = ? ' +
                'WHERE Id = ? ';
            query = query.replace(/\[SCHEMA\]/g, schema);
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
            let query = 'UPDATE [SCHEMA].businesstypes ' +
                'SET Visible = ? ' +
                'WHERE Id = ? ';
            query = query.replace(/\[SCHEMA\]/g, schema);
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
            let query = 'INSERT [SCHEMA].businesstypes ' +
                ' SET ?'
            query = query.replace(/\[SCHEMA\]/g, schema);
            connection.query(query, businessType,
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
                let query = 'SELECT HT.Id as id, HT.Type as value ' +
                    'FROM [SCHEMA].hangertypes HT ' +
                    'WHERE HT.Visible = 1 ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
            let query = 'UPDATE [SCHEMA].hangertypes ' +
                'SET Type = ? ' +
                'WHERE Id = ? ';
            query = query.replace(/\[SCHEMA\]/g, schema);
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
            let query = 'UPDATE [SCHEMA].hangertypes ' +
                'SET Visible = ? ' +
                'WHERE Id = ? ';
            query = query.replace(/\[SCHEMA\]/g, schema);
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
            let query = 'INSERT [SCHEMA].hangertypes ' +
                ' SET ?'
            query = query.replace(/\[SCHEMA\]/g, schema);
            connection.query(query, businessType,
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
                let query = 'SELECT S.Id as id, S.Status as value ' +
                    'FROM [SCHEMA].storeStatus S ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'INSERT [SCHEMA].stores SET ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, store, (err, res) => {
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
                let query = 'INSERT [SCHEMA].userstore SET ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, store, (err, res) => {
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
                let query = 'UPDATE [SCHEMA].stores ' +
                    'SET Lat = ?, Lon = ?, Name = ?, ' +
                    'ZoneId = ?, Description = ?, Image = ?, ' +
                    'BusinessTypeId = ?, HangerTypeId = ?, Ruc = ?, StatusId = ? ' +
                    'WHERE Location = ?';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'INSERT [SCHEMA].storehistorical SET ?';
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, storeHistorical, (err, res) => {
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
                let query = 'INSERT [SCHEMA].storeAddress (Categorie, Value, LocationId, Type) VALUES ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [addressStores.map(address => [address.Categorie, address.Value, address.LocationId, address.Type])], (err, res) => {
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
                let query = 'DELETE FROM [SCHEMA].storeAddress WHERE LocationId = ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [locationId], (err, res) => {
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
            let query = 'SELECT mt.value as method, au.value as authorized ' +
                'FROM [SCHEMA].authorizers au ' +
                'INNER JOIN [SCHEMA].methods mt ON au.source = mt.source ' +
                'WHERE mt.methodName = ? and au.source = ?; ';
            query = query.replace(/\[SCHEMA\]/g, schema);
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

    getAllStores: function (user, zone) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'SELECT sh.Date, s.Location as location, s.Lat as lat, s.Lon as lon, s.Name as name, s.Description as description, s.Image as image, s.Ruc as ruc, ' +
                    'st.Id as statusId, st.Status as status, st.Marker as marker, st.ClassStyle as classStyle, st.ShowDateField as showDate, sh.DateToShow as historicalDate, ' +
                    'z.Id as zoneId, b.Id as businessTypeId, b.Type as businessType, h.Id as hangerTypeId, h.Type as hangerType, ' +
                    'a.Type as addressType, a.Value as address, a.Id as addressId, a.Categorie as addressCategorie, ' +
                    'sh.LocationId as locationMarker, sh.StatusId as statusHistorical, sh.DateToShow as date, sh.LocationId as locationMarker, ' +
                    'sh.Id as historicalId, sh.SellValue as sellValue, sth.ClassStyle as historicalClassStyle, sth.ShowHistorical as showHistorical, sth.ShowDateField as showDateField ' +
                    'FROM [SCHEMA].stores s ' +
                    'INNER JOIN [SCHEMA].storehistorical sh on s.Location = sh.LocationId ' +
                    'INNER JOIN [SCHEMA].storeAddress a on s.Location = a.LocationId ' +
                    'INNER JOIN [SCHEMA].storeStatus st on s.StatusId = st.Id ' +
                    'INNER JOIN [SCHEMA].businesstypes b on s.BusinessTypeId = b.Id ' +
                    'INNER JOIN [SCHEMA].hangertypes h on s.HangerTypeId = h.Id ' +
                    'INNER JOIN [SCHEMA].zones z on s.ZoneId = z.Id ' +
                    'INNER JOIN [SCHEMA].userzones UZ ON z.Id = UZ.Zone ' +
                    'INNER JOIN [SCHEMA].storeStatus sth on sth.Id = sh.StatusId ' +
                    'WHERE a.Categorie = "PR" and UZ.UserKey = ? ';
                query = query.replace(/\[SCHEMA\]/g, schema);
                if(!!zone) {
                    query = query + 'and z.Id = ? ';
                }
                query = query + 'ORDER BY sh.Date desc';

                connection.query(query, [user, zone], (err, rows) => {
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

    getAllStoresByZone: function (user, zone) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'SELECT sh.Date, s.Location as location, s.Lat as lat, s.Lon as lon, s.Name as name, s.Description as description, s.Image as image, s.Ruc as ruc, ' +
                    'st.Id as statusId, st.Status as status, st.Marker as marker, st.ClassStyle as classStyle, st.ShowDateField as showDate, sh.DateToShow as historicalDate, ' +
                    'z.Id as zoneId, b.Id as businessTypeId, b.Type as businessType, h.Id as hangerTypeId, h.Type as hangerType, ' +
                    'a.Type as addressType, a.Value as address, a.Id as addressId, a.Categorie as addressCategorie, ' +
                    'sh.LocationId as locationMarker, sh.StatusId as statusHistorical, sh.DateToShow as date, sh.LocationId as locationMarker, ' +
                    'sh.Id as historicalId, sh.SellValue as sellValue, sth.ClassStyle as historicalClassStyle, sth.ShowHistorical as showHistorical, sth.ShowDateField as showDateField ' +
                    'FROM Stores.stores s ' +
                    'INNER JOIN [SCHEMA].storehistorical sh on s.Location = sh.LocationId ' +
                    'INNER JOIN [SCHEMA].storeAddress a on s.Location = a.LocationId ' +
                    'INNER JOIN [SCHEMA].storeStatus st on s.StatusId = st.Id ' +
                    'INNER JOIN [SCHEMA].businesstypes b on s.BusinessTypeId = b.Id ' +
                    'INNER JOIN [SCHEMA].hangertypes h on s.HangerTypeId = h.Id ' +
                    'INNER JOIN [SCHEMA].zones z on s.ZoneId = z.Id ' +
                    'INNER JOIN [SCHEMA].userzones UZ ON z.Id = UZ.Zone ' +
                    'INNER JOIN [SCHEMA].storeStatus sth on sth.Id = sh.StatusId ' +
                    'WHERE a.Categorie = "PR" and UZ.UserKey = ? ' +
                    'ORDER BY sh.Date desc';
                query = query.replace(/\[SCHEMA\]/g, schema);
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

    getStoresByZones: function (zones) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'SELECT s.Location as location, s.Name as name ' +
                    'FROM [SCHEMA].stores s ' +
                    'WHERE s.ZoneId in (?) ';
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [zones], (err, rows) => {
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
                let query = 'UPDATE [SCHEMA].stores SET StatusId = ? WHERE Location = ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [statusId, locationId], (err, res) => {
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

    getOrdersOutOfDate: function () {
        return new Promise((resolve, reject) => {
            try {
                let month = new Date().getMonth() + 1;
                if(month < 10) {
                    month = '0' + month;
                }
                let day = new Date().getDate();
                if(day < 10) {
                    day = '0' + day;
                }
                const date = new Date().getFullYear() + '-' + month + '-' + day + ' ' + '23:59:59';
                let query = 'SELECT S.Location as location, S.Name as name, O.user_register as responsable ' +
                    'FROM [SCHEMA].orders O ' +
                    'INNER JOIN [SCHEMA].stores S ON O.store = S.Location ' +
                    'WHERE O.visible = 1 AND O.deliver_date < ? ' +
                    'GROUP BY S.Location ';
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [date], (err, rows) => {
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

    changeStoresStatus: function (locationsId, statusId) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'UPDATE [SCHEMA].stores ' +
                    'SET StatusId = ? ' +
                    'WHERE Location in (?)'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [statusId, locationsId], (err, res) => {
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
                let query = 'SELECT s.Location as location, s.Lat as lat, s.Lon as lon, ' +
                    's.Name as name, s.Description as description, s.Image as image, s.Ruc as ruc ' +
                    'FROM [SCHEMA].stores s ' +
                    'WHERE s.StatusId = ? ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'SELECT S.Store as id ' +
                    'FROM [SCHEMA].userstore S ' +
                    'WHERE S.UserKey = ? ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'SELECT U.Roll as roll ' +
                    'FROM [SCHEMA].users U ' +
                    'WHERE U.UserKey = ? ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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

    getUserZonesStore: function (user, zone) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'SELECT id, S.Location as location, S.Name as name ' +
                    'FROM [SCHEMA].userstore US ' +
                    'INNER JOIN [SCHEMA].stores S on US.Store = S.Location ' +
                    'WHERE S.ZoneId = ? and US.UserKey = ?';
                query = query.replace(/\[SCHEMA\]/g, schema);
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
                let query = 'SELECT S.Location as location, S.Name as name ' +
                    'FROM [SCHEMA].stores S ' +
                    'WHERE S.ZoneId = ? ';
                query = query.replace(/\[SCHEMA\]/g, schema);
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

    addUserZones: function (userZones) {
        return new Promise((resolve, reject) => {
            try {
                let query  = 'INSERT [SCHEMA].userzones (Zone, UserKey) VALUES ?'
                const values = [userZones]
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, values, (err, res) => {
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

    addUserZonesStores: function (userZonesStores) {
        return new Promise((resolve, reject) => {
            try {
                let query  = 'INSERT [SCHEMA].userstore (Store, UserKey) VALUES ?'
                const values = [userZonesStores];
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, values, (err, res) => {
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

    deleteUserZones: function (user) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'DELETE FROM [SCHEMA].userzones WHERE UserKey = ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
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

    deleteUserZonesStore: function (user, stores) {
        return new Promise((resolve, reject) => {
            try {
                let query = 'DELETE FROM [SCHEMA].userstore ' +
                    'WHERE UserKey = ? and Store in ?'
                query = query.replace(/\[SCHEMA\]/g, schema);
                connection.query(query, [user, [stores]], (err, res) => {
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

    updateZone: function (id, name) {
        return new Promise((resolve, reject) => {
            let query = 'UPDATE [SCHEMA].zones ' +
                'SET name = ? ' +
                'WHERE id = ? ';
            query = query.replace(/\[SCHEMA\]/g, schema);
            connection.query(query, [name, id], (err, res) => {
                if (err) {
                    console.log(tag, err);
                    reject('SQL ERROR');
                    return;
                }
                resolve(res);
            });
        });
    },

    addZone: function (name) {
        return new Promise((resolve, reject) => {
            const zone = {name: name}
            let query = 'INSERT [SCHEMA].zones ' +
                ' SET ?'
            query = query.replace(/\[SCHEMA\]/g, schema);
            connection.query(query, zone,
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


};
