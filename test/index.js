const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../bin/www');
const should = chai.should();

chai.use(chaiHttp);
if (!process.server)
  process.server = server

process.data = require("./data.json");
const controllers = require('./controllers');
