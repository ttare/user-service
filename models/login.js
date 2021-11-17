const Base = require("./base");
const {Messages} = process.utils;

class Login extends Base {
  constructor({username, password}) {
    super(...arguments);
    this.username = username;
    this.password = password;
  }

}

const LGTM = Login.LGTM;
Login.validator = LGTM.validator(
  LGTM.validates('username').required(Messages.required("username")),
  LGTM.validates('password').required(Messages.required("password")))
  .build();


module.exports = Login;
