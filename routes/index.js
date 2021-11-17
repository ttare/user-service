const fs = require('fs');
const _ = require('lodash');
const models = require('../models');

const catchError = (action) => (...args) => action(...args);
module.exports = function (app, express, passport, catchError = catchError, path = "") {
  const controllers = require('../controllers');
  fs.readdirSync(__dirname)
    .filter(function (file) {
      return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
      if (file.slice(-3) !== '.js') return;
      const name = file.replace('.js', '');

      const router = express.Router();
      const Controller = controllers[`${_.upperFirst(name.trim())}Controller`];
      const route = require(`./${name.trim()}`);
      route.apply(new Controller(), [{router, passport, catchError}, models]);
      if (name === "main")
        app.use(`${path}`, router);
      else
        app.use(`${path}/${name.trim()}`, router);
    });
};
