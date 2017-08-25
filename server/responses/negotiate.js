module.exports = (res) => (data) => {
  let status = 500;
  let message = data;
  logger.debug(status, data);
  if (typeof data === 'string') {
    return res.status(status).json({
      error: data
    });
  }
  const keys = Object.keys(data);
  if (keys.includes('errors') || keys.includes('sql')) {
    status = 400;
    message = {
      name: data.name,
      errors: data.errors,
      fields: data.fields
    };
  }

  logger.error(data);
  return res.status(status).json(message);
};
