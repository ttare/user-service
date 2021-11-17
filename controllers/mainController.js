const {Messages, APIError} = process.utils;
const db = process.db;
const passport = require('passport');

class MainController {
  constructor() {

  }

  async signup(req, res, next) {
    passport.authenticate('signup', async (err, user, info) => {
      if (err)
        return console.error(err).then(x => res.status(500).json(x));

      if (info)
        return res.status(400).json(info);

      return res.json(user);
    })(req, res, next);
  }

  async login(req, res, next) {
    passport.authenticate('jwt-local', function (err, user) {
      if (err)
        return console.error(err).then(x => res.status(500).json(x));

      if (!user)
        return res.status(401).json(new APIError(Messages.incorrectEmailOrPassword(), 1000));

      return res.json(user);
    })(req, res, next);
  }

  async mostLikedUsers(req, res, next) {
    const users = await db.User.findAll({
      include: {
        attributes: [],
        model: db.Like,
      },
      attributes: [
        'username',
        [db.sequelize.cast(db.sequelize.fn('COUNT', db.sequelize.col('Likes.user_id')), 'integer'), 'likes']
      ],
      group: ['User.id'],
      order: db.sequelize.literal("likes DESC"),
    });

    return res.send(users);
  }
}

module.exports = MainController;
