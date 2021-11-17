class APIError {
  constructor(message, code, args) {
    this.message = APIError.formating(message, args) || "";
    this.code = code || 1000;
    this.args = args || [];
  }

  static formating() {
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
      const reg = new RegExp("\\{" + i + "\\}", "gm");
      s = s.replace(reg, arguments[i + 1]);
    }
    return s;
  }

  static catchError(action) {
    return (req, res, next) => action(req, res, next).catch(ex => console.error(ex).then(x => res.status(500).json(x)))
  }
}

const _error = console.error;
console.error = (...args) => {
  return new Promise((resolve, reject) => {
    _error(...args);
    resolve(new process.utils.APIError("Error on server", 1000));
  });
};

module.exports = APIError;
