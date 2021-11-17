const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require("passport");

process.configuration = require("./configuration");
process.utils = require("./utils");
process.db = require("./db");

const {APIError} = process.utils;

const Auth = require("./auth");
const API = require('./routes');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());

new Auth(passport, app);
new API(app, express, passport, APIError.catchError);

app.use(function (err, req, res, next) {
    if (err.stack)
        console.error(err.stack);

    res
        .status(err.status || 500)
        .json(new process.utils.APIError("Error on server",1000));
});

app.use(function (req, res, next) {
    res
        .status(404)
        .json(new process.utils.APIError("REST API: Resources does not exist",1404));
});



module.exports = app;
