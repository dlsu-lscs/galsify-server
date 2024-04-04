const userAuth = (req, res, next) => {
  console.log("userAuth bypass");
  next();
}

module.exports = { userAuth }
