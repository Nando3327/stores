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

    getZones: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT Z.Id as id, Z.Name as name ' +
                    'FROM Stores.zones Z ';
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
                    'FROM Stores.businesstypes BT ';
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

    getHangerTypes: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT HT.Id as id, HT.Type as value ' +
                    'FROM Stores.hangertypes HT ';
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

    getAllStores: function () {
        return new Promise((resolve, reject) => {
            try {
                const query = 'SELECT sh.Date, s.Location as location, s.Lat as lat, s.Lon as lon, s.Name as name, s.Description as description, s.Image as image, s.Ruc as ruc, ' +
                    'st.Id as statusId, st.Status as status, st.Marker as marker, st.ClassStyle as classStyle, st.ShowHistorical as showHistorical, st.ShowDateField as showDateField, ' +
                    'z.Id as zoneId, b.Id as businessTypeId, b.Type as businessType, h.Id as hangerTypeId, h.Type as hangerType, ' +
                    'a.Type as addressType, a.Value as address, a.Id as addressId, a.Categorie as addressCategorie, ' +
                    'sh.LocationId as locationMarker, sh.StatusId as statusHistorical, sh.DateToShow as date, sh.LocationId as locationMarker, ' +
                    'sh.Id as historicalId, sh.SellValue as sellValue, sth.ClassStyle as historicalClassStyle ' +
                    'FROM Stores.stores s ' +
                    'INNER JOIN Stores.storehistorical sh on s.Location = sh.LocationId ' +
                    'INNER JOIN Stores.address a on s.Location = a.LocationId ' +
                    'INNER JOIN Stores.status st on s.StatusId = st.Id ' +
                    'INNER JOIN Stores.businesstypes b on s.BusinessTypeId = b.Id ' +
                    'INNER JOIN Stores.hangertypes h on s.HangerTypeId = h.Id ' +
                    'INNER JOIN Stores.zones z on s.ZoneId = z.Id ' +
                    'INNER JOIN Stores.status sth on sth.Id = sh.StatusId ' +
                    'WHERE a.Categorie = "PR" ' +
                    'ORDER BY sh.Date desc';
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
    }
};
