const morgan = require('morgan');
const cors = require('cors');
const express = require('express');

function middlewares(app) {
  app.use(cors());
  //Middlewares
  app.use(morgan('dev')); //logger
  app.use(express.json()); //body parser
  app.use(express.urlencoded({ extended: false })); //body parser

  app.use((req, res, next) => {
    console.log('req.originalUrl :>> ', req.originalUrl);
    console.log('req.body :>> ', req.body);
    next();
  });
}

module.exports = middlewares;
