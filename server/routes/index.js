/* global include */
const express = require('express');

const Router = express.Router();
//Handling Routes
//Routes
Router.use('/user', require('./users'));
Router.use('/tip', require('./tips'));

// 404
Router.use((req, res, next) => {
  const error = new Error();
  error.status = 404;
  error.message = '404 NOT FOUND';
  return next(error);
});

module.exports = Router;
