let dm = require('../dataManagement/dataManagement');
const axios = require('axios').default;
const DateModelFormatClass = require('../models/DateModelFormat.model');
const DateModelFormat = new DateModelFormatClass();

let sortFilterData = function (data, filter, max, sort, orientation) {
    let responseData = filterData(data, filter, max);
    return sortData(responseData, sort, orientation);
};

let filterData = function (data, filter, max) {
    if (max === "true") {
        return data.filter(x => {
            const words = x.title.split(' ');
            return words.length > filter;
        })
    }
    return data.filter(x => {
        const words = x.title.split(' ');
        return words.length <= filter;
    })
};

let sortData = function (data, sort, orientation) {
    if (orientation === 'asc') {
        return data.sort(function (a, b) {
            return a[sort] - b[sort];
        });
    }
    return data.sort(function (a, b) {
        return b[sort] - a[sort];
    });
};

let createAlias = function (user) {
    return user.name.substring(0, 1).toUpperCase() + user.lastname.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 10000);
};

let formatDates = function (date, separator = '/', format = DateModelFormat.dayMonthYear) {
    let month = date.getMonth() + 1;
    let ret = '';
    switch (format) {
        case DateModelFormat.yearMonthDay: {
            ret = date.getFullYear() + separator + month + separator + date.getDate();
            break;
        }
        case DateModelFormat.yearMonthDayCeros: {
            ret = date.getFullYear() + separator + padLeft(month.toString(), 2) + separator + padLeft(date.getDate().toString(), 2);
            break;
        }
        case DateModelFormat.dayMonthYearCeros: {
            ret = padLeft(date.getDate().toString(), 2) + separator + padLeft(month.toString(), 2) + separator + date.getFullYear();
            break;
        }

        case DateModelFormat.dateWithoutSeparatorAM: {
            ret = date.getFullYear() + padLeft(month.toString(), 2);
            break;
        }
        case DateModelFormat.dateWithoutSeparatorAMD: {
            ret = date.getFullYear() + padLeft(month.toString(), 2) + padLeft(date.getDate().toString(), 2);
            break;
        }
        default: {
            ret = date.getDate() + separator + month + separator + date.getFullYear();
            break;
        }
    }
    return ret;
};

let padLeft = function (str, len, ch = '0') {
    len = len - str.length + 1;
    return len > 0 ?
        new Array(len).join(ch) + str : str;
};

let validateExistAlias = function (user) {
    let alias = createAlias(user);
    return new Promise((resolve) => {
        dm.validateExistAlias(alias).then(valid => {
            if (valid) {
                validateExistAlias(user);
            } else {
                resolve(alias);
            }
        }).catch(e => {
            reject(e);
        });
    });
};

module.exports = {
    getData: function (filter, max, sort, orientation, getAllData) {
        return dm.getData().then($ => {
            const dataTemplate = $('.itemlist > tbody > tr ');
            const header = [];
            const body = [];
            dataTemplate.each(function () {
                const rank = $(this).find('.rank').text();
                const title = $(this).find('.storylink').text();
                if (rank !== '' && title !== '') {
                    header.push({
                        id: header.length,
                        rank: rank,
                        title: title
                    });
                }
            });
            dataTemplate.each(function () {
                const score = $(this).find('.score').text();
                const comments = $(this).find('.subtext').text();
                if (comments !== '') {
                    body.push({
                        id: body.length,
                        score: (score === '') ? 0 : parseInt(score.split(' ')[0]),
                        comments: (comments.indexOf('comment') > -1) ? parseInt(comments.split('|')[2].trim().split(' ')[0]) : 0
                    });
                }
            });
            const data = [];
            header.forEach(function (h) {
                for (let i = 0; i < body.length; i++) {
                    if (h.id === body[i].id) {
                        data.push({
                            rank: h.rank,
                            title: h.title,
                            score: body[i].score,
                            comments: body[i].comments
                        });
                        return;
                    }
                }
            });
            if (getAllData) {
                return data;
            }
            return sortFilterData(data, filter, max, sort, orientation)
        });
    },

    getUserInfo: function (user) {
        return dm.getUserData(user).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    name: '',
                    lastName: '',
                    alias: '',
                    key: '',
                    email: '',
                    changePassword: false,
                    profiles: [],
                    profileData: {}
                }
            };
            if (data) {
                response.data.name = data.Name;
                response.data.lastName = data.LastName;
                response.data.alias = data.Alias;
                response.data.key = data.UserKey;
                response.data.email = data.Email;
                response.data.changePassword = (data.ChangePassword === 1);
                response.data.profiles = data.profiles;
                let defaultProfile = data.profiles.find( p => {
                    return p.principal === 1
                });
                if(defaultProfile === undefined) {
                    defaultProfile = data.profiles[0];
                }
                return dm.getUserTransactions(data.UserKey, defaultProfile.id).then(profileData => {
                    if(profileData) {
                        response.data.profileData = profileData;
                    }else{
                        response.code = 8009;
                        response.message = 'USUARIO SIN ATRIBIUCIONES';
                        response.data = {};
                    }
                    return response;
                });
            } else {
                response.code = 8001;
                response.message = 'USUARIO Y/O PASSWORD INCORRECTO';
                return response;
            }
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    getProfileData: function (user, profile) {
        return dm.getUserTransactions(user, profile).then(data => {
            const response = {
                code: 200,
                message: 'OK',
                data: {
                    profileData: {}
                }
            };
            if(data) {
                response.data.profileData = data;
            }else{
                response.code = 8009;
                response.message = 'USUARIO SIN ATRIBIUCIONES';
                response.data = {};
            }
            return response;
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    registerUser: function (user, mail) {
        return dm.validateExistEmailAddres(mail).then(existEmail => {
            if (existEmail) {
                return {
                    code: 8000,
                    message: 'EMAIL YA REGISTRADO',
                    data: {}
                };
            }
            return validateExistAlias(user).then(alias => {
                user.setAlias(alias);
                user.setUserKey(alias);
                return dm.registerUser(user, mail).then(data => {
                    try {
                        const response = {
                            code: 200,
                            message: 'OK',
                            data: {}
                        };
                        if (!data) {
                            response.code = 8001;
                            response.message = 'ERROR REGISTRANDO USUARIO';
                        }
                        return dm.getAuthorizer('NOTIFICATIONS', 'REGISTER').then(dataAuthorizer => {
                            if (!dataAuthorizer) {
                                response.code = 8001;
                                response.message = 'NO EXISTE INFORMACION EN AUTORIZADOR PARA ENVIO CORREOS';
                                return response;
                            }
                            return axios.post(dataAuthorizer.authorized + dataAuthorizer.method, {
                                "code": "1000",
                                "source": "FR",
                                "data": {
                                    "USUARIO": user.name + ' ' + user.lastname,
                                    "FECHA": formatDates(new Date(), '/', DateModelFormat.yearMonthDayCeros),
                                    "USERKEY": alias
                                },
                                "receiver": mail
                            })
                                .then(function (res) {
                                    if (res && res.data && res.data.error) {
                                        response.data = res.data;
                                    }
                                    return response;
                                })
                                .catch(function (error) {
                                    response.message = 'SU CORREO VA A SER ENVIADO EN CUALQUIER MOMENTO, USUARIO CREADO CON EXITO';
                                    return response;
                                });
                        });
                    } catch (e) {
                        throw e
                    }
                }).catch(e => {
                    console.log(e);
                    throw e
                });
            });
        }).catch(e => {
            console.log(e);
            throw e
        });
    },

    restorePassword: function (mail) {
        return dm.getUserDataByEmail(mail).then(userData => {
            if (userData) {
                const response = {
                    code: 200,
                    message: 'OK',
                    data: {}
                };
                const password = Math.random().toString(36).slice(-8);
                return dm.updateUserPassword(userData, password).then(updateUser => {
                    if (updateUser) {
                        return dm.getAuthorizer('NOTIFICATIONS', 'REGISTER').then(dataAuthorizer => {
                            if (!dataAuthorizer) {
                                response.code = 8001;
                                response.message = 'NO EXISTE INFORMACION EN AUTORIZADOR PARA ENVIO CORREOS';
                                return response;
                            }
                            return axios.post(dataAuthorizer.authorized + dataAuthorizer.method, {
                                "code": "1002",
                                "source": "FR",
                                "data": {
                                    "USERKEY": userData.Alias,
                                    "PASSWORD": password
                                },
                                "receiver": mail
                            })
                                .then(function (res) {
                                    if (res && res.data && res.data.error) {
                                        response.data = res.data;
                                    }
                                    return response;
                                })
                                .catch(function (error) {
                                    response.message = 'SU CORREO VA A SER ENVIADO EN CUALQUIER MOMENTO, ENVIO DE PASSWORD GENERADO CORRECTO';
                                    return response;
                                });
                        });
                    } else {
                        return {
                            code: 8004,
                            data: {},
                            message: 'NO SE PUDO ACTUALIZAR EL PASSWORD'
                        }
                    }

                });
            } else {
                return {
                    code: 8003,
                    data: {},
                    message: 'CORREO NO REGISTRADO'
                }
            }

        })
    },

    forgetUser: function (mail) {
        return dm.getUserDataByEmail(mail).then(userData => {
            if (userData) {
                const response = {
                    code: 200,
                    message: 'OK',
                    data: {}
                };
                return dm.getAuthorizer('NOTIFICATIONS', 'REGISTER').then(dataAuthorizer => {
                    if (!dataAuthorizer) {
                        response.code = 8001;
                        response.message = 'NO EXISTE INFORMACION EN AUTORIZADOR PARA ENVIO CORREOS';
                        return response;
                    }
                    return axios.post(dataAuthorizer.authorized + dataAuthorizer.method, {
                        "code": "1001",
                        "source": "FR",
                        "data": {
                            "USERKEY": userData.Alias
                        },
                        "receiver": mail
                    })
                        .then(function (res) {
                            if (res && res.data && res.data.error) {
                                response.data = res.data;
                            }
                            return response;
                        })
                        .catch(function (error) {
                            response.message = 'SU CORREO VA A SER ENVIADO EN CUALQUIER MOMENTO, ENVIO DE USUARIO CORRECTO';
                            return response;
                        });
                });
            } else {
                return {
                    code: 8003,
                    data: {},
                    message: 'CORREO NO REGISTRADO'
                }
            }

        })
    },

    setPassword: function (user, oldPassword, password) {
        return dm.getUserData({
            name: user,
            password: oldPassword
        }).then(userData => {
            if (userData) {
                const response = {
                    code: 200,
                    message: 'OK',
                    data: {}
                };
                return dm.updateUserPassword(userData, password, false).then(updateUser => {
                    if (updateUser) {
                        return response;
                    } else {
                        return {
                            code: 8004,
                            data: {},
                            message: 'NO SE PUDO ACTUALIZAR EL PASSWORD'
                        }
                    }

                });
            } else {
                return {
                    code: 8006,
                    data: {},
                    message: 'PASSWORD ANTERIOR INCORRECTO'
                }
            }

        })
    },

    setAlias: function (user, newAlias) {
        const response = {
            code: 200,
            message: 'OK',
            data: {}
        };
        return dm.updateUserAlias(user, newAlias).then(updateUser => {
            if (updateUser) {
                return response;
            } else {
                return {
                    code: 8004,
                    data: {},
                    message: 'NO SE PUDO ACTUALIZAR EL ALIAS'
                }
            }
        });
    },

};
