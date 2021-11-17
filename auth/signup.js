const LocalStrategy = require('passport-local').Strategy;

const db = process.db;

module.exports = function (passport) {
  passport.use('signup', new LocalStrategy({
      passReqToCallback: true
    },
    async function (req, username, password, done) {
      try {
        let user = db.User.build({
          username: username.toLowerCase(),
        });
        user.salt = user.makeSalt(16);
        user.password = await user.encryptPassword(password);

        user = await user.save();
        done(null, {id: user.id});
      } catch (ex) {
        console.error(ex).then(done);
      }
    })
  );
};
