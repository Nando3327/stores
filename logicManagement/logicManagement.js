let dm = require('../dataManagement/dataManagement');
const StoreHistoricalModel = require('../models/storeHistorical.model');

let saveNewStore = function (store) {
    return new Promise((resolve, reject) => {
        dm.saveNewStore(store).then(data => {
            resolve(data);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
};

let updateStore = function (store) {
    return new Promise((resolve, reject) => {
        dm.updateStore(store).then(data => {
            resolve(data);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
};

let addStoreHistorical = function (storeHistorical) {
    return new Promise((resolve, reject) => {
        dm.addStoreHistorical(storeHistorical).then(data => {
            resolve(data);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
};


module.exports = {

    getZones: function () {
        return dm.getZones().then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    zones: []
                }
            };
            if(data) {
                response.data.zones = data;
            }else{
                response.message = 'NO EXISTEN ZONAS REGISTRADAS';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getBusinessTypes: function () {
        return dm.getBusinessTypes().then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    businessType: []
                }
            };
            if(data) {
                response.data.businessType = data;
            }else{
                response.message = 'NO EXISTEN TIPOS DE NEGOCIO REGISTRADOS';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getHangerTypes: function () {
        return dm.getHangerTypes().then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    hangerType: []
                }
            };
            if(data) {
                response.data.hangerType = data;
            }else{
                response.message = 'NO EXISTEN TIPOS DE PERCHAS REGISTRADOS';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    saveStore: function (store, mode, userKey) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        const storeHistorical = new StoreHistoricalModel(store.Location, store.StatusId, new Date().toISOString().split('T')[0], userKey, 0, new Date().toISOString().split('T')[0], 'DATOS DE TIENDA ACTUALIZADOS');
        if(mode === 'edit') {
            return updateStore(store).then(data => {
                if (!data) {
                    response.code = 8002;
                    response.message = 'ERROR AL EDITAR TIENDA';
                    return response;
                }
                response.data.message = 'TIENDA ACTUALIZADA';
                return addStoreHistorical(storeHistorical).then(data => {
                    if (!data) {
                        response.message = 'ERROR AL GUARDAR HISTORICOS';
                        return response;
                    }
                    return response;
                }).catch(e => {
                    console.log(e);
                    response.message = 'ERROR AL GUARDAR HISTORICOS CATCH';
                    return response;
                });
            }).catch(e => {
                console.log(e);
                throw e
            });
        } else {
            return saveNewStore(store).then(data => {
                if (!data) {
                    response.code = 8001;
                    response.message = 'ERROR AL GUARDAR TIENDA';
                    return response;
                }
                storeHistorical.setLocationId(data.insertId);
                storeHistorical.setDescription("TIENDA CREADA");
                response.data.message = 'TIENDA CREADA';
                return addStoreHistorical(storeHistorical).then(data => {
                    if (!data) {
                        response.message = 'ERROR AL GUARDAR HISTORICOS';
                        return response;
                    }
                    return response;
                }).catch(e => {
                    console.log(e);
                    response.message = 'ERROR AL GUARDAR HISTORICOS CATCH';
                    return response;
                });
            }).catch(e => {
                console.log(e);
                throw e
            });
        }
    },
};
