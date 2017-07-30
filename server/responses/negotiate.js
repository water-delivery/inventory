module.exports = (res) => (data) => {
  let status = 500;
  let message = data;
  const keys = Object.keys(data);
  if (keys.includes('errors') || keys.includes('sql')) {
    status = 400;
    message = {
      name: data.name,
      errors: data.errors,
      fields: data.fields
    };
  }
  return res.status(status).json(message);
}
