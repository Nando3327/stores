let dm = require('../dataManagement/dataManagement');
const statusConfig = require('../configs/status.json');
const StoreHistoricalModel = require('../models/storeHistorical.model');
const StoreHistoricalResponseModel = require('../models/storeHistorical-response.model');
const AddressModel = require('../models/address.model');
const AddressResponseModel = require('../models/address-response.model');
const StoreResponseModel = require('../models/store-response.model');
const axios = require('axios').default;
const historicalConfig = require('../configs/historical.json');
const orderStatus = require('../configs/orderStatus.json');

let getCurrentDateTimeMysql = function () {
    const currentDate = new Date();
    const time = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    return currentDate.toISOString().split('T')[0] + ' ' + time;
}

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

let overrideAddresses = function (locationId, addressStores) {
    return new Promise((resolve, reject) => {
        dm.deleteAddressByLocationId(locationId).then(data => {
            if(addressStores && addressStores.length) {
                dm.addAddress(addressStores).then(data => {
                    resolve(data);
                }).catch(e => {
                    console.log(e);
                    reject(e);
                });
            } else {
                resolve(data);
            }
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
};

let getStoreData = function (stores) {
    const storesData = [];
    const storesAdded = [];
    stores.forEach((store) => {
        if(storesAdded.indexOf(store.location) === -1) {
            const responseObject = new StoreResponseModel(store.location, store.zoneId, store.statusId, store.name, store.lat, store.lon, store.description, store.image, store.businessTypeId, store.hangerTypeId, store.ruc, store.status, store.businessType, store.hangerType, store.marker, store.classStyle, store.showDate, store.historicalDate)
            responseObject.setAddresses(getAddressesStore(store.location, stores));
            responseObject.setHistorical(getHistoricalStore(store.location, stores).splice(0, historicalConfig.historicalSizeData));
            storesData.push(responseObject);
            storesAdded.push(store.location);
        }
    })
    return storesData;
};

let getAddressesStore = function (locationId, stores) {
    const storeData = stores.filter((store) => store.location === locationId) || [];
    const addressStoreAdded = [];
    const address = [];
    storeData.forEach((store) => {
        if(addressStoreAdded.indexOf(store.addressId) === -1) {
            const addressStore = new AddressResponseModel(locationId, store.addressCategorie, store.address, store.addressType);
            address.push(addressStore);
            addressStoreAdded.push(store.addressId);
        }
    })
    return address;
};

let getHistoricalStore = function (locationId, stores) {
    const storeData = stores.filter((store) => store.location === locationId && store.showHistorical) || [];
    const historicalStoreAdded = [];
    const historical = [];
    storeData.forEach((store) => {
        if(historicalStoreAdded.indexOf(store.historicalId) === -1) {
            let date = '';
            try {
                date = new Date(store.date).toISOString().split('T')[0];
            } catch(_) {
                date = store.date;
                console.log('ERROR AL TRANSFORMAR FECHA', store.date);
            }
            const historicalData = new StoreHistoricalResponseModel(locationId, store.statusHistorical, date, store.sellValue, store.historicalClassStyle, store.showDateField);
            historical.push(historicalData);
            historicalStoreAdded.push(store.historicalId);
        }
    })
    return historical;
};

let saveHistoricalAddress = function (storeHistorical, addressStores, response, locationId) {
    return addStoreHistorical(storeHistorical).then(data => {
        if (!data) {
            response.message = 'ERROR AL GUARDAR HISTORICOS';
        }
        return overrideAddresses(locationId, addressStores).then(data => {
            if (!data) {
                response.code = 6002;
                response.message += ' ERROR AL GUARDAR DIRECCIONES';
                return response;
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 6002;
            response.message = 'ERROR AL GUARDAR CATCH';
            return response;
        });
    }).catch(e => {
        console.log(e);
        response.code = 6002;
        response.message = 'ERROR AL GUARDAR HISTORICOS CATCH';
        return response;
    });
}

let addHistorical = function (response, locationId, statusId, userKey, sellValue, dateToShow) {
    response.data.message = 'ESTADO ACTUALIZADO';
    const date = getCurrentDateTimeMysql();
    const storeHistorical = new StoreHistoricalModel(locationId, statusId, date, userKey, sellValue, dateToShow, 'ESTATUS ACTUALIZADO');
    return addStoreHistorical(storeHistorical).then(data => {
        if(!data) {
            response.code = 6003;
            response.message = 'ERROR AL ACTUALIZAR ESTADO HISTORICO';
        }
        return response
    }).catch(e => {
        console.log(e);
        response.code = 6003;
        response.message = 'ERROR AL ACTUALIZAR ESTADO HISTORICO CATCH';
        return response
    });
}


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

    getStatus: function () {
        return dm.getStatus().then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    status: []
                }
            };
            if(data) {
                response.data.status = data;
            }else{
                response.message = 'NO EXISTEN STATUS REGISTRADOS';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getAllStores: function (mode) {
        return dm.getAllStores().then(stores => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    stores: []
                }
            };
            if(stores) {
                response.data.stores = getStoreData(stores);
            }else{
                response.message = 'NO EXISTEN TIENDAS REGISTRADAS';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    saveStore: function (store, mode, address, userKey) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        const date = getCurrentDateTimeMysql();
        const storeHistorical = new StoreHistoricalModel(store.Location, store.StatusId, date, userKey, 0, new Date().toISOString().split('T')[0], 'DATOS DE TIENDA ACTUALIZADOS');
        const addressStores = [];
        address.forEach((add) => {
            const addressStore = new AddressModel(store.Location, add.categorie, add.value, add.type);
            addressStores.push(addressStore);
        });
        if(mode === 'edit') {
            return updateStore(store).then(data => {
                if (!data) {
                    response.code = 6002;
                    response.message = 'ERROR AL EDITAR TIENDA';
                    return response;
                }
                response.data.message = 'TIENDA ACTUALIZADA';
                return saveHistoricalAddress(storeHistorical, addressStores, response, store.Location);
            }).catch(e => {
                console.log(e);
                throw e
            });
        } else {
            return saveNewStore(store).then(data => {
                if (!data) {
                    response.code = 6001;
                    response.message = 'ERROR AL GUARDAR TIENDA';
                    return response;
                }
                storeHistorical.setLocationId(data.insertId);
                storeHistorical.setDescription("TIENDA CREADA");
                response.data.message = 'TIENDA CREADA';
                addressStores.forEach((add) => {
                    add.setLocationId(data.insertId);
                });
                return saveHistoricalAddress(storeHistorical, addressStores, response, data.insertId);
            }).catch(e => {
                console.log(e);
                throw e
            });
        }
    },

    changeStoreStatus: function (locationId, statusId, userKey, sellValue, dateToShow) {
        return dm.changeStoreStatus(locationId, statusId).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {}
            };
            if(data) {
                if(statusId === statusConfig.noSell) {
                    return dm.getAuthorizer('ORDERS', 'UPDATEITEMORDER').then(dataAuthorizer => {
                        if (!dataAuthorizer) {
                            response.code = 6001;
                            response.message = 'NO EXISTE INFORMACION EN AUTORIZADOR ACTUALIZAR ORDENES';
                        }
                        return axios.post(dataAuthorizer.authorized + dataAuthorizer.method, {
                            "store": locationId,
                            "oldOrderStatus": orderStatus.visible,
                            "newOrderStatus": orderStatus.noSell,
                            "user": userKey,
                            "action": 'Orden cancelada por no venta'
                        })
                            .then(function (_) {
                                return addHistorical(response, locationId, statusId, userKey, sellValue, dateToShow);
                            })
                            .catch(function (_) {
                                response.message = 'NO SE PUDO ELIMINAR ORDEN ATADA A TIENDA';
                                return addHistorical(response, locationId, statusId, userKey, sellValue, dateToShow);
                            });
                    })
                } else {
                    return addHistorical(response, locationId, statusId, userKey, sellValue, dateToShow);
                }
            }else{
                response.code = 6003;
                response.message = 'ERROR AL ACTUALIZAR ESTADO';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    resetStoresStatus: function (oldStatus, newStatus, userKey, dateToShow, sellValue) {
        const response = {
            code: 200,
            message: 'OK',
            data: {}
        };
        return dm.getStoresByStatus(oldStatus).then(data => {
            if(data && data.length) {
                return new Promise((resolve) => {
                    let counterStore = 0;
                    data.forEach((store) => {
                        dm.changeStoreStatus(store.location, newStatus).then(dataStatusChange => {
                            counterStore++
                            if(dataStatusChange) {
                                addHistorical(response, store.location, newStatus, userKey, sellValue, dateToShow).then();
                            }
                            if(counterStore >= data.length){
                                response.data.message = 'ESTADOS ACTUALIZADOS';
                                resolve(response);
                            }
                        }).catch(e => {
                              console.log(e);
                              throw e
                        });
                    });
                })
            }else{
                response.message = 'NO EXISTEN TIENDAS CON ESTADO SELECCIONADO';
                return response;
            }
        }).catch(e => {
            console.log(e);
            throw e
        });
    }
};
