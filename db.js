const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("[GALZify] Connected to MongoDB Database successful.");
  })
  .catch((e) => {
    console.error(`[GALZify] Connection to MongoDB Database has failed. Error: ${e}`);
  })

module.exports = mongoose
