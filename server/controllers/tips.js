const moment = require('moment');
const Tips = require('../models/tips');
const {
  createResponse,
  successMessage,
  failedMessage,
  noDataMessage,
} = require('../utils');
module.exports = {
  getTips: async (req, res, next) => {
    console.log('getTips()');
    try {
      const {
        analyticsType = null,
        startDate = null,
        endDate = null,
      } = req.query;
      const user = req.user;
      if (!user) return createResponse(res, 401, 'No User Login');
      if (!analyticsType) {
        const tips = await getAllTipsByUserId(user._id);
        return createResponse(
          res,
          200,
          tips.length ? successMessage : noDataMessage,
          tips
        );
      }
      if (
        typeof analyticsType !== 'string' ||
        (analyticsType !== 'tipPercentage' &&
          analyticsType !== 'mostVisitedPlaces')
      ) {
        return createResponse(
          res,
          400,
          `Invalid analyticsType ${analyticsType}`
        );
      }
      const DATE_FORMAT = 'DD-MM-YYYY';
      const inValidDate =
        moment(startDate, DATE_FORMAT).format(DATE_FORMAT) !== startDate ||
        moment(endDate, DATE_FORMAT).format(DATE_FORMAT) !== endDate;
      if (inValidDate || !startDate || !endDate) {
        return createResponse(res, 400, 'Invalid start/end Date');
      }
      let data;
      switch (analyticsType) {
        case 'tipPercentage':
          data = await getTipAnalytics(
            user._id,
            startDate,
            endDate,
            'tipPercentage'
          );
          break;
        case 'mostVisitedPlaces':
          data = await getTipAnalytics(user._id, startDate, endDate, 'spentAt');
          break;
        default:
          data = [];
      }
      return createResponse(res, 200, successMessage, data);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  tipCalculate: async (req, res, next) => {
    console.log('tipCalculate()');
    try {
      const { place, totalAmount, tipPercentage } = req.body;
      const user = req.user;
      const tip = (totalAmount * tipPercentage) / 100;
      const tipData = {
        spentAt: place,
        totalAmount,
        tipPercentage,
        tipAmount: tip,
        userId: user._id,
      };

      const newTip = new Tips(tipData);
      await newTip.save();
      return createResponse(res, 200, successMessage, tip);
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
};

const getAllTipsByUserId = async (userId) => {
  if (!userId) throw new Error('userId is required.');
  const tips = await Tips.find({ userId });
  return tips;
};

const getTipAnalytics = async (
  userId,
  startDate,
  endDate,
  groupBy = 'tipPercentage'
) => {
  const from = moment(startDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const to = moment(endDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
  const tips = await Tips.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(from), $lte: new Date(to) },
        userId,
      },
    },
    {
      $group: {
        _id: `$${groupBy}`,
        [groupBy]: { $first: `$${groupBy}` }, //$first accumulator
        noOfTimes: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $limit: 1 },
  ]);
  return tips;
};
