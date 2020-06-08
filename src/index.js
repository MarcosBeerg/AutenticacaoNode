const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());

app.post('/login', function (req, res) {
console.log ("req: ",req.body);
    if (req.body.UserName != "berg" || req.body.PassWord!= "1234") {
        res.json({ success: false, message: 'Usuário ou senha incorretos!' });

    } else {

        let usuario = {
            age : 20,
            name:"berg"
        }

        var token = jwt.sign(usuario, 'berg',process.env.SECRET, {
            expiresIn:"1h"
        });

        res.json({
            success: true,
            message: 'Token criado!!!',
            token: token
        });
    }


});


app.use(function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, 'berg', function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Falha ao tentar autenticar o token!' });
            } else {

                req.decoded = decoded;
                next();
            }
        });

    } else {
        // se não tiver o token, retornar o erro 403
        return res.status(403).send({
            success: false,
            message: '403 - Forbidden'
        });
    }
});


app.get('/', function (req, res) {
    res.json({ message: 'Autenticacao em node', version: 2.0 });
});

app.listen(3000);