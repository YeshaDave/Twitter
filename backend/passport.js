'use strict';
const JwtStrategy = require('passport-jwt').Strategy;
const { jwtsecret } = require('./config');
const { simulateRequestOverKafka } = require('./KafkaRequestSimulator');

// Setup work and export for the JWT passport strategy
module.exports = passport => {
    const opts = {
        jwtFromRequest: req => req.cookies['authCookie'],
        secretOrKey: jwtsecret
    };
    passport.use(new JwtStrategy(opts, async ({ userID }, callback) => {
        try {
            const { results } = await simulateRequestOverKafka("getUsers", { userID });
            if (results.length == 1) {
                const user = results[0];
                delete user.password;
                return user.isActive === 1 ? callback(null, user) : callback(new Error("deactivated"));
            }
        } catch (e) {
            callback(e);
        }
    }));
};
