const Base = require("./base");
const db = process.db;
const {Messages} = process.utils;

class Signup extends Base {
  constructor({username, password}) {
    super(...arguments);
    this.username = username;
    this.password = password;
  }
}

const LGTM = Signup.LGTM;
Signup.validator = LGTM.validator(
  LGTM.validates('username').required(Messages.required("username"))
    .using(async x => !x || !(await db.User.count({where: {username: x.toLowerCase()}})), Messages.userAlreadyExist()),
  LGTM.validates('password').required(Messages.required("password")))
  .build();


module.exports = Signup;
