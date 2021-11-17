const LGTM = require('lgtm');
const utils = process.utils;

class Base {
  constructor() {
  }

  static get LGTM() {
    return LGTM;
  }

  static get Validator() {
    return LGTM.validator;
  }

  static async _(req, res, next) {
    try {
      let input = req.body;

      if (!input || Object.keys(input).length === 0)
        input = req.params;

      if (!input || Object.keys(input).length === 0)
        input = req.query;

      const validate = this.validate;

      if (!validate)
        return console.error(new Error("Missing class validation")).then(x => res.status(500).json(x));


      let valid = [];
      if (Array.isArray(input)) {
        for (let i = 0; i < input.length; i++) {
          const item = input[i];
          item.loggedUser = req.user; // attach user on input object;
          const result = await validate(this, item);
          if (result.valid)
            input[i] = new this(input[i]);
          else
            for (let key in result.errors)
              valid = valid.concat(result.errors[key].map(x => ({m: x, k: key})));
        }
      } else {
        input.loggedUser = req.user; // attach user on input object;
        const result = await validate(this, input);
        if (result.valid)
          input = new this(input);
        else
          for (let key in result.errors)
            valid = valid.concat(result.errors[key].map(x => ({m: x, k: key})));
      }

      if (valid.length !== 0)
        return res.status(400).json(valid.map(x => new utils.APIError(x.m, 1000, [x.k])));

      req.input = input;
      next();
    } catch (ex) {
      console.error(ex).then(x => res.status(500).json(x));
    }
  }

  static validate(CLASS, input) {
    return CLASS.validator.validate(input);
  }
}

module.exports = Base;
