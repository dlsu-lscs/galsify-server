const jwt = require('jsonwebtoken');

const userAuth = (req, res, next) => {

  const headers = req.headers['authorization'];
  const token = headers && headers.split(' ')[1] || req.body.token

  if (!token) return res.send({ status: 'error', error: 'Authorization token not found.' });

  jwt.verify(token, process.env.SECRET_KEY, (err) => {
    if (err) return res.send({ status: 'error', error: 'Invalid authorization token.' });
    next();
  });
}

module.exports = { userAuth }
