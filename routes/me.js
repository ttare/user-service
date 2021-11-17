module.exports = function ({router, passport, catchError}, {UpdatePassword}) {
  router.get('/',
    passport.isAuth(),
    catchError(this.me));

  router.post('/update-password',
    passport.isAuth(),
    UpdatePassword._.bind(UpdatePassword),
    catchError(this.updatePassword));
};
