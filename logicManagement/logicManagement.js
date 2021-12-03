let dm = require('../dataManagement/dataManagement');

module.exports = {

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
                    response.data.profileData = data;
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
                    response.data.profileData = data;
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
                    response.data.profileData = data;
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
                    countries: []
                }
            };
            if(data) {
                response.data.countries = data;
            }else{
                response.code = 8009;
                response.message = 'USUARIO SIN UBICACIONES';
                response.data = {};
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
                response.code = 8009;
                response.message = 'USUARIO SIN UBICACIONES';
                response.data = {};
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
                    places: []
                }
            };
            if(data) {
                response.data.profileData = data;
            }else{
                response.code = 8009;
                response.message = 'USUARIO SIN UBICACIONES';
                response.data = [];
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },


};
