module.exports = function ({router, passport, catchError}) {
  router.get('/:id', catchError(this.details));

  router.get('/:id/like',
    passport.isAuth(),
    catchError(this.like));

  router.get('/:id/unlike',
    passport.isAuth(),
    catchError(this.unLike));
};
