const JWTLogin = require('./jwt');
const signup = require('./signup');

const {APIError, Messages} = process.utils;

module.exports = function (passport, app) {

  // Passport auth middleware
  passport.isAuth = function () {
    return async (req, res, next) => {
      if (!req.headers.authorization)
        return res.status(401).json(new APIError(Messages.unAuthorization(), 1000));

      passport.authenticate('jwt', {session: false})(req, res, function (err) {
        if (err)
          return res.status(500).json(err);

        next();
      });
    };
  };

  signup(passport);

  JWTLogin(passport);
};
