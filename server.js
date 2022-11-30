const lm = require('./logicManagement/logicManagement');
const StoreModel = require('./models/store.model');
const ports = require('./configs/ports.json');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();

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
    if(!req.body.user){
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else {
        lm.getZones(req.body.user).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getBusinessTypes', function (req, res) {
    lm.getBusinessTypes().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
});

app.post('/getHangerTypes', function (req, res) {
    lm.getHangerTypes().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
});

app.post('/saveStore', function (req, res) {
    if(!req.body.zoneId || !req.body.statusId || !req.body.name ||
        !req.body.lat || !req.body.lon || !req.body.description ||
        !req.body.image || !req.body.businessTypeId || !req.body.hangerTypeId ||
        !req.body.ruc || !req.body.address || !req.body.mode || !req.body.user) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else {
        const store = new StoreModel(req.body.zoneId, req.body.statusId, req.body.name,
            req.body.lat, req.body.lon, req.body.description,
            req.body.image, req.body.businessTypeId, req.body.hangerTypeId,
            req.body.ruc);
        if(req.body.mode === 'edit') {
            store.setLocation(req.body.location)
        }
        lm.saveStore(store, req.body.mode, req.body.address, req.body.user).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getAllStores', function (req, res) {
    if(!req.body.user || !req.body.zone){
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else {
        lm.getAllStores(req.body.user, req.body.zone).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getStoresByZones', function (req, res) {
    if(!req.body.zones){
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else {
        lm.getStoresByZones(req.body.zones).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/changeStoreStatus', function (req, res) {
    if(!req.body.locationId || !req.body.statusId || !req.body.user || req.body.sellValue === null || req.body.sellValue === undefined || !req.body.date) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else {
        lm.changeStoreStatus(req.body.locationId, req.body.statusId, req.body.user, req.body.sellValue, req.body.date).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getStatus', function (req, res) {
    lm.getStatus().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
});

app.post('/resetStatus', function (req, res) {
    if(!req.body.oldStatus || !req.body.newStatus || !req.body.user || req.body.sellValue === null || req.body.sellValue === undefined || !req.body.date) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else {
        lm.resetStoresStatus(req.body.oldStatus, req.body.newStatus, req.body.user, req.body.date, req.body.sellValue).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/updateBusinessType', function (req, res) {
    if(!req.body.id || !req.body.type) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.updateBusinessType(req.body.id, req.body.type).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/addBusinessType', function (req, res) {
    if(!req.body.type) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.addBusinessType(req.body.type).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/deleteBusinessType', function (req, res) {
    if(!req.body.id) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.deleteBusinessType(req.body.id).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/updateHangerType', function (req, res) {
    if(!req.body.id || !req.body.type) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.updateHangerType(req.body.id, req.body.type).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/addHangerType', function (req, res) {
    if(!req.body.type) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.addHangerType(req.body.type).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/deleteHangerType', function (req, res) {
    if(!req.body.id) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.deleteHangerType(req.body.id).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getUserZonesStore', function (req, res) {
    if(!req.body.user || !req.body.zone) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getUserZonesStore(req.body.user, req.body.zone).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getZonesStore', function (req, res) {
    if(!req.body.zone) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getZonesStore(req.body.zone).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/getAllZones', function (req, res) {
    lm.getAllZones().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
});

app.post('/addUserZones', function (req, res) {
    if(!req.body.zones || !req.body.user) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.addUserZones(req.body.zones, req.body.user).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/addUserZonesStore', function (req, res) {
    if(!req.body.zone || !req.body.user || !req.body.stores) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.addUserZonesStore(req.body.zone, req.body.user, req.body.stores).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/updateZone', function (req, res) {
    if(!req.body.id || !req.body.name) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.updateZone(req.body.id, req.body.name).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/addZone', function (req, res) {
    if(!req.body.name) {
        respuesta = {
            error: true,
            code: 4000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.addZone(req.body.name).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err.message;
            res.send(errorResponse);
        });
    }
});

app.post('/manageOrdersOutOfDate', function (req, res) {
    lm.manageOrdersOutOfDate().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
});


http.createServer(app).listen(ports.host, () => {
    console.log('Server started at http://localhost:' + ports.host);
});
