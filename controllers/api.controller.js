const fs = require('fs/promises');

exports.getApi = async (req, res, next) => {
  try {

const endpointsData = await fs.readFile('./endpoints.json', 'utf-8');

const parsedDataEndpoints = JSON.parse(endpointsData);

res.status(200).json(parsedDataEndpoints);

    
  } catch (err) {
    console.error('[err]', err)
    next(err);
  }
};
