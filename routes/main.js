module.exports = function ({router, passport, catchError}, {Login, Signup}) {
  router.post('/login',
    Login._.bind(Login),
    catchError(this.login));

  router.post('/signup',
    Signup._.bind(Signup),
    catchError(this.signup));

  router.get('/most-liked',
    catchError(this.mostLikedUsers));
};
