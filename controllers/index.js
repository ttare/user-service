const fs = require('fs');
const path = require('path');
const _ = require('lodash');

let _controllers = {};

const files = fs.readdirSync(__dirname);
files.forEach(function (file) {
  const fullPath = path.join(__dirname, file);
  if (file.indexOf('.') !== 0 && file !== 'index.js') {
    const Controller = require(fullPath);
    _controllers[Controller.name] = Controller;
  }
});

module.exports = _controllers;
