const fs = require('fs');
const path = require('path');

module.exports = function () {
  let model;
  const files = fs.readdirSync(__dirname);
  files.forEach(function (file) {
    const fullPath = path.join(__dirname, file);
    if (file.indexOf('.') !== 0 && file !== 'index.js')
      model = require(fullPath);
  });
}();
