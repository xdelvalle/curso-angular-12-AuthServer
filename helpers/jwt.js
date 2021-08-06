const jwt = require('jsonwebtoken');

const generarJwt = (uid, name) => {
    const payload = { uid, name };

    return new Promise((resolve, reject) => {

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '24h'
        }, (error, token) => {
            if (error) {
                console.log(error);
                reject(error);
            }

            resolve(token);
        });

    });
}

module.exports = {
    generarJwt
}
