const lm = require('./logicManagement/logicManagement');

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


app.post('/getUserPlaces', function (req, res) {
    if(!req.body.user || !req.body.mode) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getUserPlaces(req.body.user, req.body.mode).then(data => {
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

app.post('/getUserPlacesCountry', function (req, res) {
    if(!req.body.user || !req.body.country) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getUserPlacesCountry(req.body.user, req.body.country).then(data => {
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

app.post('/getUserCountries', function (req, res) {
    if(!req.body.user) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getUserCountries(req.body.user).then(data => {
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

app.post('/getUserLocationDetail', function (req, res) {
    if(!req.body.user || !req.body.location) {
        respuesta = {
            error: true,
            code: 6000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getUserLocationDetail(req.body.user, req.body.location).then(data => {
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

http.createServer(app).listen(6001, () => {
    console.log('Server started at http://localhost:6001');
});
