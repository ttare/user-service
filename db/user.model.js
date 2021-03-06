const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = function (sequalize, DataTypes) {
  const User = sequalize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    salt: DataTypes.STRING,
  }, {
    tableName: 'users',
  });

  User.associate = function (db) {
    db.User.hasMany(db.Like, {foreignKey: "liked_by"});
    db.User.hasMany(db.Like, {foreignKey: "user_id"});
  };

  User.prototype.makeSalt = function (byteSize) {
    return crypto.randomBytes(byteSize).toString('base64');
  };

  User.prototype.encryptPassword = function (password) {
    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, 'base64');
    password = password || crypto.randomBytes(16).toString('base64');

    return new Promise(function (resolve) {
      crypto.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', function (err, key) {
        if (err) return resolve(null);
        return resolve(key.toString('base64'));
      });
    })
  };

  User.prototype.validPassword = async function (pwd) {
    const password = await this.encryptPassword(pwd);
    return this.password === password;
  };

  User.prototype.toJSON = function () {
    let user = this.get({plain: true});
    user.password = undefined;
    user.salt = undefined;
    return user;
  };

  User.prototype.genereteAccessToken = function (secretKey) {
    return jwt.sign(this.toJSON(), secretKey)
  };

  return User;
};
