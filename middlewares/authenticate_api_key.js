const authenticateApiKey = (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(403).json({ message: 'Api key is missing' });
    }
    next();
  };
  
  module.exports = authenticateApiKey;
  