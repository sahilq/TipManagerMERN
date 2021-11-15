const express = require('express');
const router = express.Router(); //using default router instead promise router
const { validateBody, schemas } = require('../helper/routeHelpers');

const passport = require('passport');
require('../passport');
const Tips = require('../controllers/tips');

const passportJWT = passport.authenticate('jwt', { session: false });

router.post(
  '/calculate',
  passportJWT,
  validateBody(schemas.tipSchema),
  Tips.tipCalculate
);

router.get('/', passportJWT, validateBody(schemas.getTipsSchema), Tips.getTips);

module.exports = router;
