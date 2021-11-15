//middleware for server side validation

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error.details);
      }
      if (!req.value) {
        req.value = {};
      }
      req.body = result.value;
      next();
    };
  },
  schemas: {
    authSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
    regSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
    }),
    tipSchema: Joi.object().keys({
      place: Joi.string().required(),
      totalAmount: Joi.number().required(),
      tipPercentage: Joi.number().required(),
    }),
    getTipsSchema: Joi.object().keys({
      analyticsType: Joi.string().valid('tipPercentage', 'mostVisitedPlaces.'),
      startDate: Joi.date(),
      endDate: Joi.date(),
    }),
  },
};
