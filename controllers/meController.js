const db = process.db;

class MeController {
  constructor() {

  }

  async me(req, res, next) {
    res.json(req.user);
  }

  async updatePassword(req, res, next) {
    const user = await db.User.findByPk(req.user.id);
    const {password} = req.input;

    user.salt = user.makeSalt(16);
    user.password = await user.encryptPassword(password);
    await user.save();


    return res.send({success: true});
  }
}

module.exports = MeController;
