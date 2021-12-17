let dm = require('../dataManagement/dataManagement');

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














    getUserPlaces: function (user, mode) {
        if(mode === 'All') {
            return dm.getUserPlaces(user, mode).then(data => {
                const response = {
                    code: 200,
                    message: 'OK',
                    data: {
                        places: []
                    }
                };
                if(data) {
                    response.data.places = data;
                }else{
                    response.message = 'USUARIO SIN UBICACIONES';
                }
                return response;
            }).catch(e => {
                console.log(e);
                throw e
            });
        } else if(mode === 'Visited'){
            return dm.getUserPlacesByVisited(user, 1).then(data => {
                const response = {
                    code: 200,
                    message: 'OK',
                    data: {
                        places: []
                    }
                };
                if(data) {
                    response.data.places = data;
                }else{
                    response.message = 'USUARIO SIN UBICACIONES';
                }
                return response;
            }).catch(e => {
                console.log(e);
                throw e
            });
        } else {
            return dm.getUserPlacesByVisited(user, 0).then(data => {
                const response = {
                    code: 200,
                    message: 'OK',
                    data: {
                        places: []
                    }
                };
                if(data) {
                    response.data.places = data;
                }else{
                    response.message = 'USUARIO SIN UBICACIONES';
                }
                return response;
            }).catch(e => {
                console.log(e);
                throw e
            });
        }


    },

    getUserPlacesCountry: function (user, country) {
        return dm.getUserPlacesCountry(user, country).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    places: []
                }
            };
            if(data) {
                response.data.places = data;
            }else{
                response.message = 'USUARIO SIN UBICACIONES';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getUserCountries: function (user) {
        return dm.getUserCountries(user).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    countries: []
                }
            };
            if(data) {
                response.data.countries = data;
            }else{
                response.message = 'USUARIO SIN PAISES';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getUserLocationDetail: function (user, location) {
        return dm.getUserLocationDetail(user, location).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    details: []
                }
            };
            if(data) {
                response.data.details = data;
            }else{
                response.message = 'USUARIO SIN DETALLES DE UBICACION';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    setCountryStatus: function (user, country, favorite = 0) {
        return dm.setCountryStatus(user, country, favorite).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    message: ''
                }
            };
            if(data) {
                response.data.message = data;
            }else{
                response.code = 6002
                response.message = 'ERROR EN ACTUALIZACION DEL STATUS';
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },


};
