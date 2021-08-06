const {response} = require('express');
const Usuario = require('../../models/Usuario');
const bcrypt = require('bcryptjs');
const {generarJwt} = require("../../helpers/jwt");

const crearUsuario = async (req, res = response) => {
    const {email, name, password} = req.body;
    // console.log(name, email, password);

    try {
        // Verificar que no exista otro email
        let usuario = await Usuario.findOne({email: email});
        if (usuario) {
            return res.status(400)
                .json({
                    ok: false,
                    msg: 'El usuario ya existe en la BD'
                });
        }

        // Creamos usuario
        const dbUsuario = new Usuario(req.body);

        // Hashear la contrasña
        const salt = bcrypt.genSaltSync();
        dbUsuario.password = bcrypt.hashSync(password, salt);

        // Generar JWT
        const token = await generarJwt(dbUsuario.id, name);

        // Crear el usuario en la BD
        await dbUsuario.save();

        // Generar respiuesta exitosa
        return res.status(201)
            .json({
                ok: true,
                uid: dbUsuario.id,
                name: name,
                token: token
            });

    } catch (error) {
        console.log(error)
        return res.status(500)
            .json({
                ok: false,
                msg: 'Error desconocido! contactar con el administrador.'
            });
    }
}

const login = async (req, res = response) => {
    const {email, password} = req.body;
    // console.log(email, password);

    try {

        const dbUsuario = await Usuario.findOne({email: email});
        if (!dbUsuario) {
            return res.status(400)
                .json({
                    ok: false,
                    msg: 'El correo no existe'
                });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, dbUsuario.password);

        if (!validPassword) {
            return res.status(400)
                .json({
                    ok: false,
                    msg: 'El password no es válido'
                });
        }

        // Generar JWT
        const token = await generarJwt(dbUsuario.id, dbUsuario.name);

        return res.json({
            ok: true,
            uid: dbUsuario.id,
            name: dbUsuario.name,
            token: token
        })

    } catch (err) {
        console.log(res);
        return res.status(500)
            .json({
                ok: false,
                msg: 'Error desconocido! contactar con el administrador.'
            });
    }
}

const renewToken = async (req, res = response) => {
    const { uid, name } = req;

    const token = await generarJwt(uid, name);

    return res.json({
        ok: true,
        uid: uid,
        name: name,
        token: token
    })
}

module.exports = {
    crearUsuario,
    login,
    renewToken
}
