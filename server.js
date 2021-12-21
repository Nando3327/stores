const lm = require('./logicManagement/logicManagement');
const StoreModel = require('./models/store.model');
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
    lm.getZones().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
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
    lm.getAllStores().then(data => {
        respuesta.code = data.code;
        respuesta.data = data.data;
        respuesta.message = data.message;
        res.send(respuesta);
    }).catch(err => {
        errorResponse.message = err.message;
        res.send(errorResponse);
    });
});

http.createServer(app).listen(6002, () => {
    console.log('Server started at http://localhost:6002');
});
