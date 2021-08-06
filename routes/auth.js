const { Router } = require('express');
const { crearUsuario, login, renewToken } = require("./controllers/auth.controller");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {validarJwt} = require("../middlewares/validar-jwt");

const router = Router();

const NEW_USER_ENDPOINT = '/new';
const LOGIN_ENDPOINT = '/';
const RENEW_TOKEN_ENDPOINT = '/renew';

router.post(NEW_USER_ENDPOINT, [
    check('name', 'El nombre es obligatorio').not().isEmpty(), // Express Validator
    check('email', 'El email debe tener formato de email').isEmail(),
    check('password', 'La contraseña no cumple con (minimo 6 caracteres)').isLength({min: 6}),
    validarCampos
], crearUsuario);

router.post(LOGIN_ENDPOINT,[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña no cumple con (minimo 6 carcteres)').isLength({min: 6}),
    validarCampos
], login);

router.get(RENEW_TOKEN_ENDPOINT, validarJwt, renewToken);

module.exports = router;
