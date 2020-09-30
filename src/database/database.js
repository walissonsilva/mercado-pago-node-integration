const mongoose = require('mongoose');

require('dotenv').config();

const connection = mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connection done.');
}).catch((err) => {
  console.log('Error during database connection process.');
})

module.exports = connection;