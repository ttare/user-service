const Base = require("./base");
const {Messages} = process.utils;

class UpdatePassword extends Base {
  constructor({password}) {
    super(...arguments);
    this.password = password;
  }
}

const LGTM = UpdatePassword.LGTM;
UpdatePassword.validator = LGTM.validator(
  LGTM.validates('password').required(Messages.required("password")))
  .build();


module.exports = UpdatePassword;
