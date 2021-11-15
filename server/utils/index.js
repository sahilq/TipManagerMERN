module.exports = {
  createResponse: (
    res,
    status = 200,
    message = '',
    data = {},
    header = null
  ) => {
    header = header ? header : null;
    return res
      .status(status)
      .set(header)
      .json({
        status: status,
        message: message,
        data: data,
        ...(header && { header }),
      });
  },
  successMessage: 'Success',
  failedMessage: 'Failed',
  noDataMessage: 'No Data',
};
