const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const db = process.db;
const {JWT} = process.configuration;

module.exports = function (passport) {
  passport.use(new JwtStrategy({
    session: false,
    secretOrKey: process.configuration.JWT.secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  }, async (payload, done) => {
    try {
      const user = await db.User.findOne({where: {id: payload.id}});

      if (!user)
        return done();

      return done(null, user);
    } catch (ex) {
      console.error(ex).then(done);
    }
  }));

  passport.use('jwt-local', new LocalStrategy({
      passReqToCallback: true
    },
    async function (req, username, password, done) {
      try {
        if (!username || username === "")
          return done();

        const user = await db.User.findOne({where: {username: username.toLowerCase()}});
        if (!user)
          return done();

        const isValid = await user.validPassword(password);
        if (!isValid)
          return done();

        done(null, {token: `Bearer ${user.genereteAccessToken(JWT.secretOrKey)}`});
      } catch (ex) {
        console.error(ex).then(done);
      }
    }
  ));
};
