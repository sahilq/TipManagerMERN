const express = require('express');

const app = express(); //init express as app
const path = require('path');
const fs = require('fs');
// app.use(express.static('../public'));
var public = path.join(__dirname, '../public');
app.get('/public/user/:id', function (req, res) {
  const { id } = req.params;
  if (!id) return res.status(404).end('user id is required.');
  res.sendFile(path.join(public, `/user/${id}`));
});

app.use('/public', express.static(public));

// Middlewares
require('./middlewares')(app);

// Database
require('./config/db')();

//Routes
app.use('/', require('./routes'));

//Some error

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
