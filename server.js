const lm = require('./logicManagement/logicManagement');
const LoginModel = require('./models/login.model');
const User = require('./models/User.model');

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


/**
 * get data filter by values
 * filter: number of words in title
 * max: "true" indicates that the number of words in title must be greater than filter, otherwise words in title must be smaller than filter
 * sort: indicates the field by which it will be ordered
 * orientation: sort in asc/desc order
 */
app.get('/data/:filter/:max/:sort/:orientation', (req, res) => {
    lm.getData(parseInt(req.params.filter), req.params.max, req.params.sort, req.params.orientation, false).then(data => {
        res.status(200).send({message: 'OK', data: data});
    })
});

/**
 * get all data
 */
app.get('/data', (req, res) => {
    lm.getData(0, '', '', '', true).then(data => {
        res.status(200).send({message: 'OK', data: data});
    })
});

/**
 *Ejemplo post
 */
app.post('/login', function (req, res) {
    if(!req.body.name || !req.body.password) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Error de usuario y/o contraseña'
        };
        res.send(respuesta);
    }else{
        const user = new LoginModel(req.body.name, req.body.password);
        lm.getUserInfo(user).then(data => {
            respuesta.code = data.code;
            respuesta.data = data.data;
            respuesta.message = data.message;
            res.send(respuesta);
        }).catch(err => {
            errorResponse.message = err;
            res.send(errorResponse);
        });
    }
});

app.post('/register', function (req, res) {
    if(!req.body.name || !req.body.password || !req.body.email || !req.body.lastName) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Error en registro de usuario'
        };
        res.send(respuesta);
    }else{
        const user = new User(req.body.name, req.body.lastName, req.body.password);
        lm.registerUser(user, req.body.email).then(data => {
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

app.post('/restoreUser', function (req, res) {
    if(!req.body.mail) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Email requerido'
        };
        res.send(respuesta);
    }else{
        lm.forgetUser(req.body.mail).then(data => {
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

app.post('/restorePassword', function (req, res) {
    if(!req.body.mail) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Email requerido'
        };
        res.send(respuesta);
    }else{
        lm.restorePassword(req.body.mail).then(data => {
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

app.post('/resetPassword', function (req, res) {
    if(!req.body.user || !req.body.oldPassword || !req.body.password) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } if(req.body.oldPassword ===req.body.password ) {
        respuesta = {
            error: true,
            code: 8008,
            message: 'Password anterior y password actual son los mismos'
        };
        res.send(respuesta);
    }else{
        lm.setPassword(req.body.user, req.body.oldPassword, req.body.password).then(data => {
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

app.post('/changeAlias', function (req, res) {
    if(!req.body.user || !req.body.newAlias || !req.body.alias) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } if(req.body.alias === req.body.newAlias ) {
        respuesta = {
            error: true,
            code: 8008,
            message: 'No se puede agregar el mismo alias al usuario'
        };
        res.send(respuesta);
    }else{
        lm.setAlias(req.body.user, req.body.newAlias).then(data => {
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

app.post('/changeProfile', function (req, res) {
    if(!req.body.user || !req.body.profile) {
        respuesta = {
            error: true,
            code: 8000,
            message: 'Datos incompletos'
        };
        res.send(respuesta);
    } else{
        lm.getProfileData(req.body.user, req.body.profile).then(data => {
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

http.createServer(app).listen(8001, () => {
    console.log('Server started at http://localhost:8001');
});
