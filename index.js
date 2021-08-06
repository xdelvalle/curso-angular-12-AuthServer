// INSTALACIONES DEL PROYECTO
// npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose


// User: xavi - Pass Mongo: Vv7eRk3aiUioNrIT

const express = require('express');
const auth = require('./routes/auth');
const cors = require('cors');
const {dbConnection} = require("./db/config");

require('dotenv').config();

// Variables de entorno (Se ha añadido el PORT)
// console.log(process.env);

// Crear el servidor/app de express
const app = express();

// Conexion a la BD
dbConnection();

// Directorio publico
app.use(express.static('public'))

// CORS
app.use( cors() );

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', auth);

app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el #${ process.env.PORT }`)
});
