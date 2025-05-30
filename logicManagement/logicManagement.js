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
const images = require('../configs/images.json');
const roles = require('../configs/rol.json');
const imageEnv = require('../configs/imageEnv.json');

let getCurrentDateTimeMysql = function () {
    const currentDate = new Date();
    const time = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds();
    return currentDate.toISOString().split('T')[0] + ' ' + time;
}

let saveNewStore = function (store, environment) {
    return new Promise((resolve, reject) => {
        dm.saveNewStore(store, environment).then(data => {
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

let addStoreHistorical = function (storeHistorical, environment) {
    return new Promise((resolve, reject) => {
        dm.addStoreHistorical(storeHistorical, environment).then(data => {
            resolve(data);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
};

let addUserZoneStore = function (stores, user, response, environment) {
    const userZonesStores = [];
    stores.forEach((storeId) => {
        userZonesStores.push([storeId, user])
    })
    return dm.addUserZonesStores(userZonesStores, environment).then(data => {
        if(data){
            response.data.message = 'TIENDAS AGREGADAS POR ZONA ';
        } else {
            response.data.message = 'NO SE PUDO AGREGAR TIENDAS AL USUARIO POR ZONA ';
        }
        return response;
    }).catch(e => {
        console.log(e);
        response.code = 4003;
        response.data.message = 'NO SE PUDO AGREGAR TIENDAS AL USUARIO POR ZONA ';
        return response;
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
            const imgStored = store.image?.split('images/');
            let img = '';
            if(imgStored && imgStored.length > 1) {
                img = imageEnv.host + 'images/' + imgStored[1];
            }
            const image = (images.returnImages) ? img: '';
            const responseObject = new StoreResponseModel(store.location, store.zoneId, store.statusId, store.name, store.lat, store.lon, store.description, image, store.businessTypeId, store.hangerTypeId, store.ruc, store.status, store.businessType, store.hangerType, store.marker, store.classStyle, store.showDate, store.historicalDate)
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
            let date;
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

let saveHistoricalAddress = function (storeHistorical, addressStores, response, locationId, environment) {
    return addStoreHistorical(storeHistorical, environment).then(data => {
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

let saveStoreUser = function (storeId, userKey, environment) {
    return new Promise((resolve, reject) => {
        dm.saveStoreUser(storeId, userKey, environment).then(data => {
            resolve(data);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
}

let addHistorical = function (response, locationId, statusId, userKey, sellValue, dateToShow, environment) {
    response.data.message = 'ESTADO ACTUALIZADO';
    const date = getCurrentDateTimeMysql();
    const storeHistorical = new StoreHistoricalModel(locationId, statusId, date, userKey, sellValue, dateToShow, 'ESTATUS ACTUALIZADO');
    return addStoreHistorical(storeHistorical, environment).then(data => {
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

let getUserRol = function (user) {
    return new Promise((resolve, reject) => {
        dm.getUserRol(user).then(data => {
            if(data && data.length) {
                resolve(data[0]);
            } else {
                resolve(0);
            }
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
}

let getStoresForUser = function (user, environment) {
    return new Promise((resolve, reject) => {
        dm.getStoresByUser(user, environment).then(data => {
            const response = [];
            if(data && data.length) {
                data.forEach((storeId => {
                    response.push(storeId.id);
                }))
            }
            resolve(response);
        }).catch(e => {
            console.log(e);
            reject(e);
        });
    });
}

let parseResponseStore = function(user, stores, environment, response) {
    const allStores =  getStoreData(stores);
    return getUserRol(user).then((userInfo) => {
        if(userInfo) {
            return getStoresByRol(user, userInfo.roll, allStores, environment).then((stores) => {
                response.data.stores = stores;
                return response;
            });
        } else {
            response.data.stores = allStores;
            return response;
        }
    })
}

let getStoresByRol = function (user, roll, allStores, environment) {
    return new Promise((resolve) => {
        switch (roll) {
            case roles.admin:
            case roles.sudo:
                allStores.forEach((st) => {
                    st.setCanOpenCard(true);
                })
                resolve(allStores);
                break;
            case roles.seller:
            case roles.autoSell:
                return getStoresForUser(user, environment).then((storesUser) => {
                    allStores.forEach((st) => {
                        if(storesUser.indexOf(st.location) > -1) {
                            st.setCanOpenCard(true);
                        }
                    })
                    resolve(allStores);
                })
            case roles.tenant:
                return getStoresForUser(user, environment).then((storesUser) => {
                    allStores = allStores.filter((st) =>{
                        st.setCanOpenCard(true);
                        return storesUser.indexOf(st.location) > -1
                    });
                    resolve(allStores);
                })
            case roles.driver:
                allStores = allStores.filter((st) => {
                    st.setCanOpenCard(true);
                    return [orderStatus.return, orderStatus.request, orderStatus.delayed].indexOf(st.statusId) > -1
                });
                resolve(allStores);
                break;
            default:
                resolve(allStores);
        }
    });
}


module.exports = {

    getZones: function (user, environment) {
        return dm.getZones(user, environment).then(data => {
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

    getAllStores: function (user, zone, environment) {
        return dm.getAllStores(user, zone, environment).then(stores => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    stores: []
                }
            };
            if(stores) {
                return parseResponseStore(user, stores, environment, response);
            } else{
                response.message = 'NO EXISTEN TIENDAS REGISTRADAS';
                return response;
            }
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getStoresByZones: function (zones) {
        return dm.getStoresByZones(zones).then(stores => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    stores: []
                }
            };
            if(stores) {
                response.data.stores = stores;
                return response;
            } else{
                response.message = 'NO EXISTEN TIENDAS REGISTRADAS POR ZONAS';
                return response;
            }
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getStore: function (user, storeId, environment) {
        return dm.getStore(user, storeId, environment).then(store => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    stores: []
                }
            };
            if(store) {
                return parseResponseStore(user, store, environment, response);
            } else{
                response.message = 'NO EXISTEN TIENDAS REGISTRADAS';
                return response;
            }
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    saveStore: function (store, mode, address, userKey, environment, environments) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: '',
                environmentsResponse: []
            }
        };
        const date = getCurrentDateTimeMysql();
        const storeStatusId = (mode === 'edit') ? statusConfig.storeUpdated: store.StatusId;
        const storeHistorical = new StoreHistoricalModel(store.Location, storeStatusId, date, userKey, 0, new Date().toISOString().split('T')[0], 'DATOS DE TIENDA ACTUALIZADOS');
        const addressStores = [];
        address.forEach((add) => {
            const addressStore = new AddressModel(store.Location, add.categorie, add.value, add.type);
            addressStores.push(addressStore);
        });
        if(mode === 'edit') {
            return dm.getStoreStatus(store.Location).then((storeStatus) => {
                if(storeStatus && storeStatus.StatusId === orderStatus.request) {
                    store.setStatusId(storeStatus.StatusId);
                    return updateStore(store).then(data => {
                        if (!data) {
                            response.code = 6002;
                            response.message = 'ERROR AL EDITAR TIENDA';
                            return response;
                        }
                        response.data.message = 'TIENDA ACTUALIZADA';
                        return response;
                    }).catch(e => {
                        console.log(e);
                        throw e
                    });
                }
                return updateStore(store).then(data => {
                    if (!data) {
                        response.code = 6002;
                        response.message = 'ERROR AL EDITAR TIENDA';
                        return response;
                    }
                    response.data.message = 'TIENDA ACTUALIZADA';
                    return saveHistoricalAddress(storeHistorical, addressStores, response, store.Location, environment);
                }).catch(e => {
                    console.log(e);
                    throw e
                });
            }).catch(e => {
                console.log(e);
                throw e
            });
        } else {
            return saveNewStore(store, environment).then(data => {
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
                saveStoreUser(data.insertId, userKey, environment).then();
                const historicalRequests = []
                const lastStatusRequests = [];
                environments.forEach((env) => {
                    historicalRequests.push(saveHistoricalAddress(storeHistorical, [], response, data.insertId, env));
                    lastStatusRequests.push(dm.addStoreLastStatus(data.insertId, statusConfig.new, env));
                })

                return Promise.all(lastStatusRequests).then((values) => {
                    return Promise.all(historicalRequests).then((values) => {
                        response.data.environmentsResponse =  values.map((v) => {
                            return v.data.message
                        });
                        return saveHistoricalAddress(storeHistorical, addressStores, response, store.Location, environment).then(() => {
                            return response
                        })
                    });
                });
            }).catch(e => {
                console.log(e);
                throw e
            });
        }
    },

    changeStoreStatus: function (locationId, statusId, userKey, sellValue, dateToShow, environment) {
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
                            data: {
                                "store": locationId,
                                "oldOrderStatus": orderStatus.visible,
                                "newOrderStatus": orderStatus.noSell,
                                "user": userKey,
                                "action": 'Orden cancelada por no venta'
                            },
                            environment: environment
                        })
                            .then(function (_) {
                                return addHistorical(response, locationId, statusId, userKey, sellValue, dateToShow, environment);
                            })
                            .catch(function (_) {
                                response.message = 'NO SE PUDO ELIMINAR ORDEN ATADA A TIENDA';
                                return addHistorical(response, locationId, statusId, userKey, sellValue, dateToShow, environment);
                            });
                    })
                } else {
                    return addHistorical(response, locationId, statusId, userKey, sellValue, dateToShow, environment);
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

    resetStoresStatus: function (oldStatus, newStatus, userKey, dateToShow, sellValue, environment) {
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
                                addHistorical(response, store.location, newStatus, userKey, sellValue, dateToShow, environment).then();
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
    },

    updateBusinessType: function (id, type) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.updateBusinessType(id, type).then(data => {
            if(data){
                response.data.message = 'TIPO DE NEGOCIO ACTUALIZADO';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO ACTUALIZAR TIPO DE NEGOCIO ';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO ACTUALIZAR TIPO DE NEGOCIO ';
            return response;
        });
    },

    deleteBusinessType: function (id) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.visibleBusinessType(id, 0).then(data => {
            if(data){
                response.data.message = 'TIPO DE NEGOCIO ELIMINADO';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO ELIMINAR TIPO DE NEGOCIO ';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO ELIMINAR TIPO DE NEGOCIO ';
            return response;
        });
    },


    addBusinessType: function (type) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.addBusinessType(type).then(data => {
            if(data){
                response.data.message = 'TIPO DE NEGOCIO CREADO';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO CREAR TIPO DE NEGOCIO ';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO CREAR TIPO DE NEGOCIO ';
            return response;
        });
    },

    updateHangerType: function (id, type) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.updateHangerType(id, type).then(data => {
            if(data){
                response.data.message = 'TIPO DE PERCHA ACTUALIZADO';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO ACTUALIZAR TIPO DE PERCHA ';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO ACTUALIZAR TIPO DE PERCHA ';
            return response;
        });
    },

    deleteHangerType: function (id) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.visibleHangerType(id, 0).then(data => {
            if(data){
                response.data.message = 'TIPO DE PERCHA ELIMINADA';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO ELIMINAR TIPO DE PERCHA ';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO ELIMINAR TIPO DE PERCHA ';
            return response;
        });
    },


    addHangerType: function (type) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.addHangerType(type).then(data => {
            if(data){
                response.data.message = 'TIPO DE PERCHA CREADO';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO CREAR TIPO DE PERCHA ';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO CREAR TIPO DE PERCHA ';
            return response;
        });
    },

    getUserZonesStore: function (user, zone, environment) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                stores: []
            }
        };
        return dm.getUserZonesStore(user, zone, environment).then(data => {
            if(data){
                response.data.stores = data;
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE ENCONTRARON TIENDAS POR ZONA Y USUARIO ';
            return response;
        });
    },

    getZonesStore: function (zone) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                stores: []
            }
        };
        return dm.getZonesStore(zone).then(data => {
            if(data){
                response.data.stores = data;
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE ENCONTRARON TIENDAS POR ZONA ';
            return response;
        });
    },

    getAllZones: function () {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                zones: []
            }
        };
        return dm.getAllZones().then(data => {
            if(data){
                response.data.zones = data;
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE ENCONTRARON ZONAS ';
            return response;
        });
    },

    addUserZones: function (zones, user, environment) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: 'OK'
            }
        };
        return dm.deleteUserZones(user, environment).then(() => {
            const userZones = [];
            zones.forEach((zoneId) => {
                userZones.push([zoneId, user])
            })
            if(userZones.length) {
                return dm.addUserZones(userZones, environment).then(data => {
                    if(data){
                        response.data.message = 'ZONAS AGREGADAS ';
                    } else {
                        response.data.message = 'NO SE PUDO AGREGAR ZONAS AL USUARIO ';
                    }
                    return response;
                }).catch(e => {
                    console.log(e);
                    response.code = 4003;
                    response.data.message = 'NO SE PUDO AGREGAR ZONAS AL USUARIO ';
                    return response;
                });
            } else {
                response.data.message = 'ZONAS DE USUARIO ELIMINADAS ';
                return response;
            }
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO ELIMIANAR ZONAS DE USUARIO ';
            return response;
        });
    },

    addUserZonesStore: function (zone, user, stores, environment) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: 'OK'
            }
        };
        return dm.getUserZonesStore(user, zone, environment).then((userStoresByZone) => {
            const storesToDelete = [];
            userStoresByZone.forEach((store) => {
                storesToDelete.push(store.location)
            });
            if(storesToDelete.length) {
                return dm.deleteUserZonesStore(user, storesToDelete, environment).then(() => {
                    if(stores.length) {
                        return addUserZoneStore(stores, user, response, environment);
                    } else {
                        response.data.message = 'TIENDAS POR ZONA DE USUARIO ELIMINADAS ';
                        return response;
                    }
                }).catch(e => {
                    console.log(e);
                    response.code = 4003;
                    response.data.message = 'NO SE PUDO ELIMINAR TIENDAS POR ZONA DE USUARIO ';
                    return response;
                });
            } else {
                if(stores.length) {
                    return addUserZoneStore(stores, user, response, environment);
                } else {
                    return response;
                }
            }
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO OBTENER TIENDAS POR ZONAS DE USUARIO ';
            return response;
        });
    },

    updateZone: function (id, name) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.updateZone(id, name).then(data => {
            if(data){
                response.data.message = 'ZONA ACTUALIZADA';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO ACTUALIZAR LA ZONA';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO ACTUALIZAR LA ZONA';
            return response;
        });
    },

    addZone: function (name) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.addZone(name).then(data => {
            if(data){
                response.data.message = 'ZONA CREADA';
            } else {
                response.code = 4002;
                response.data.message = 'NO SE PUDO CREAR LA ZONA';
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO CREAR LA ZONA';
            return response;
        });
    },

    manageOrdersOutOfDate: function (environment) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                orders: []
            }
        };
        return dm.getOrdersOutOfDate(environment).then(data => {
            if(data && data.length){
                response.data.orders = data;
                const storesUotOfDate = [];
                data.forEach((store) => {
                    storesUotOfDate.push(store.location);
                })
                return dm.changeStoresStatus(storesUotOfDate, orderStatus.delayed).then(() => {
                    return response
                })
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO CREAR LA ZONA';
            return response;
        });
    },

    syncStoresZones: function (zoneId, environment, user) {
        const response = {
            code: 200,
            message: 'OK',
            data: {
                message: ''
            }
        };
        return dm.getZonesStore(zoneId).then(data => {
            if(data && data.length){
                const storesZone = data.map((dt) => dt.location);
                return dm.getHistoricalByStores(storesZone, environment).then((storesHistorical) => {
                    const storesToSync = [];
                    const lastStatusRequests = [];
                    const historicalId = storesHistorical.map((sh) => sh.id)
                    storesZone.forEach((sz) => {
                        if(historicalId.indexOf(sz) === -1) {
                            const storeHistorical = new StoreHistoricalModel(sz, statusConfig.new, getCurrentDateTimeMysql(), user, 0, new Date().toISOString().split('T')[0], 'TIENDA CREADA POR SYNCRONIZACION');
                            storesToSync.push(dm.addStoreHistorical(storeHistorical, environment));
                            lastStatusRequests.push(dm.addStoreLastStatus(sz, statusConfig.new, environment));
                        }
                    });
                    return Promise.all(lastStatusRequests).then((values) => {
                        return Promise.all(storesToSync).then(() => {
                            response.data.message = 'TIENDAS SINCRONIZADAS'
                            return response
                        });
                    });
                })
            }
            return response;
        }).catch(e => {
            console.log(e);
            response.code = 4003;
            response.data.message = 'NO SE PUDO CREAR LA ZONA';
            return response;
        });
    },
};
