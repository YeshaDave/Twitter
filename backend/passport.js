'use strict';
const JwtStrategy = require('passport-jwt').Strategy;
const { jwtsecret } = require('./config');
const { getUsers } = require('./DataAccessLayer');

// Setup work and export for the JWT passport strategy
module.exports = passport => {
    const opts = {
        jwtFromRequest: req => req.cookies['authCookie'],
        secretOrKey: jwtsecret
    };
    passport.use(new JwtStrategy(opts, async ({ userID }, callback) => {
        try {
            const { results } = await getUsers({ userID });
            if (results.length == 1) {
                const user = results[0];
                delete user.password;
                callback(null, user);
            }
        } catch (e) {
            callback(e);
        }
    }));
};
