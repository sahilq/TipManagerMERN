const JWT = require('jsonwebtoken');

const User = require('../models/users');
const { JWT_SECRET } = require('../config/index');

const { createResponse, successMessage, failedMessage } = require('../utils');

const path = require('path');
const fs = require('fs');

const _ = require('lodash');

//require sha1 from crypto-js
const sha1 = require('crypto-js/sha1'); //-> used to generate session token
//creating token
signtoken = (newUser) => {
  return JWT.sign(
    {
      sub: newUser._id,
      iat: new Date().getTime(),
      exp: Math.floor(new Date() / 1000) + 60 * 60,
    },
    JWT_SECRET
  );
};

const generateSessionToken = async (_id) => {
  //Generate hash and return string
  return await sha1(`${_.random(1, 900000)}${_id}`).toString();
};
//export function

const handleError = (err, res) => {
  console.error(err);
  return createResponse(res, 500, 'Failed to upload file');
};
module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
      //check if email available
      const foundUser = await User.findOne({ email: email });
      if (foundUser) {
        return createResponse(res, 400, 'User Exists');
      }

      if (!req?.file) {
        return createResponse(res, 400, 'proPic is required.');
      }

      //add user and save
      const newUser = new User({ email, password, name });
      const tempPath = req.file.path;
      const targetPath = path.join(
        __dirname,
        `../../public/user/${newUser._id}.jpg`
      );

      fs.renameSync(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);
      });
      newUser.picUrl = targetPath;

      //*generate session token
      const sessionToken = await generateSessionToken(newUser._id);
      newUser.sessionToken = sessionToken;

      await newUser.save();

      //generate web token
      const token = signtoken(newUser);
      const data = { token, name: newUser.name };
      //respond with token

      createResponse(res, 200, successMessage, data);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  signIn: async (req, res, next) => {
    //generate web token
    try {
      //*generate session token
      const sessionToken = await generateSessionToken(req.user._id);

      const up = await User.findOne({ _id: req.user._id });
      up.sessionToken = sessionToken;
      await up.save();

      const token = signtoken(up);
      //fetch user id
      const name = up.name;
      const data = { token, name };
      //respond with token

      return createResponse(res, 200, successMessage, data);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }, //random protected resource for testing
  secret: async (req, res, next) => {
    console.log(`User.secret() called`);
    res.json({ message: 'IN USERS SECRET' });
  },
};
