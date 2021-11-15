//require libraries
const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const upload = multer({ dest: './public/user' });

//require passport configuration
require('../passport');

//require validation middleware files
const { validateBody, schemas } = require('../helper/routeHelpers');
// require controller file for users
const User = require('../controllers/users');

//passport methods to const
const passportSignIn = passport.authenticate('local', { session: false });
const passportJWT = passport.authenticate('jwt', { session: false });

//signin action->validate body->find user->validate password->login
router
  .route('/login')
  .post(validateBody(schemas.authSchema), passportSignIn, User.signIn);

//signup actions->validate->check if already exists->create new user
router
  .route('/')
  .post(upload.single('proPic'), validateBody(schemas.regSchema), User.signUp);

//secret route
router.route('/secret').get(passportJWT, User.secret);

//export module
module.exports = router;
