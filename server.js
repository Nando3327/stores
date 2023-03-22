const lm = require('./logicManagement/logicManagement');
const StoreModel = require('./models/store.model');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

let validateCompleteData = function (reqBody) {
    return !(!reqBody.environment || !reqBody.data);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.get('/', (req, res) => {
    res.status(200).send("Welcome to API REST")
});

let respuesta = {
    error: false,
    code: 200,
    message: '',
    data: {}
};

let errorResponse = {
    error: true,
    code: 500,
    message: ''
};

app.post('/getZones', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.user){
            respuesta = {
                error: true,
                code: 6000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else {
            lm.getZones(request.user, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getBusinessTypes', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        lm.getBusinessTypes().then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getHangerTypes', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        lm.getHangerTypes().then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/saveStore', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.zoneId || !request.statusId || !request.name ||
            !request.lat || !request.lon || !request.description ||
            !request.image || !request.businessTypeId || !request.hangerTypeId ||
            !request.ruc || !request.address || !request.mode || !request.user) {
            respuesta = {
                error: true,
                code: 6000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else {
            const store = new StoreModel(request.zoneId, request.statusId, request.name,
                request.lat, request.lon, request.description,
                request.image, request.businessTypeId, request.hangerTypeId,
                request.ruc);
            if(request.mode === 'edit') {
                store.setLocation(request.location)
            }
            lm.saveStore(store, request.mode, request.address, request.user, req.body.environment, request.environments).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getAllStores', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.user || !request.zone){
            respuesta = {
                error: true,
                code: 6000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else {
            lm.getAllStores(request.user, request.zone, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getStoresByZones', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.zones){
            respuesta = {
                error: true,
                code: 6000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else {
            lm.getStoresByZones(request.zones).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/changeStoreStatus', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.locationId || !request.statusId || !request.user || request.sellValue === null || request.sellValue === undefined || !request.date) {
            respuesta = {
                error: true,
                code: 6000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else {
            lm.changeStoreStatus(request.locationId, request.statusId, request.user, request.sellValue, request.date, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getStatus', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        lm.getStatus().then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/resetStatus', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.oldStatus || !request.newStatus || !request.user || request.sellValue === null || request.sellValue === undefined || !request.date) {
            respuesta = {
                error: true,
                code: 6000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else {
            lm.resetStoresStatus(request.oldStatus, request.newStatus, request.user, request.date, request.sellValue, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/updateBusinessType', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.id || !request.type) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.updateBusinessType(request.id, request.type).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/addBusinessType', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.type) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.addBusinessType(request.type).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/deleteBusinessType', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.id) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.deleteBusinessType(request.id).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/updateHangerType', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.id || !request.type) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.updateHangerType(request.id, request.type).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/addHangerType', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.type) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.addHangerType(request.type).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/deleteHangerType', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.id) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.deleteHangerType(request.id).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getUserZonesStore', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.user || !request.zone) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.getUserZonesStore(request.user, request.zone, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getZonesStore', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.zone) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.getZonesStore(request.zone).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/getAllZones', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        lm.getAllZones().then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/addUserZones', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.zones || !request.user) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.addUserZones(request.zones, request.user, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/addUserZonesStore', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.zone || !request.user || !request.stores) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.addUserZonesStore(request.zone, request.user, request.stores, req.body.environment).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/updateZone', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.id || !request.name) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.updateZone(request.id, request.name).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/addZone', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.name) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.addZone(request.name).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/manageOrdersOutOfDate', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        lm.manageOrdersOutOfDate(req.body.environment).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});

app.post('/syncStoresZones', function (req, res) {
    if(validateCompleteData(req.body)) {
        const request = req.body.data;
        if(!request.zoneId || !request.environment || !request.user) {
            respuesta = {
                error: true,
                code: 4000,
                message: 'Datos incompletos'
            };
            res.send(respuesta);
        } else{
            lm.syncStoresZones(request.zoneId, request.environment, request.user).then(data => {
                respuesta.code = data.code;
                respuesta.data = data.data;
                respuesta.message = data.message;
                res.send(respuesta);
            }).catch(err => {
                errorResponse.message = err.message;
                res.send(errorResponse);
            });
        }
    } else {
        respuesta = {
            error: true,
            code: 5000,
            message: 'Datos Incompletos'
        };
        res.send(respuesta);
    }
});


http.createServer(app).listen(6002, () => {
    console.log('Server started at http://localhost:' + 6002);
});
