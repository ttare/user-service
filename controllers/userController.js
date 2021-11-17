const db = process.db;
const {Messages, APIError} = process.utils;

class UserController {
  constructor() {

  }

  async me(req, res, next) {
    res.json(req.user);
  }

  async updatePassword(req, res, next) {
    const {password} = req.input;

    const user = await db.User.findByPk(req.user.id);

    user.salt = user.makeSalt(16);
    user.password = await user.encryptPassword(password);
    await user.save();

    return res.send({success: true});
  }

  async details(req, res, next) {
    const user = await db.User.findByPk(req.params.id);
    const likes = await db.Like.count({
      where: {
        user_id: user.id
      }
    });

    return res.send({
      username: user.username,
      likes,
    });
  }

  async like(req, res, next) {
    if (req.user.id === req.params.id)
      return res.status(400).send([new APIError(Messages.noLike())]);

    const query = {
      liked_by: req.user.id,
      user_id: req.params.id,
    };

    let like = await db.Like.findOne({
      where: query
    });

    if (like)
      return res.send({liked: false});

    await db.Like.create(query);

    return res.send({liked: true});
  }

  async unLike(req, res, next) {
    if (req.user.id === req.params.id)
      return res.status(400).send([new APIError(Messages.noLike())]);

    const query = {
      liked_by: req.user.id,
      user_id: req.params.id,
    };

    let like = await db.Like.findOne({
      where: query
    });

    if (!like)
      return res.send({unLiked: false});

    await like.destroy();

    return res.send({unLiked: true});
  }
}

module.exports = UserController;
