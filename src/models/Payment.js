const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  code: String,
  payer: String,
  status: String
});

const Payment = mongoose.model('payment', PaymentSchema);

module.exports = Payment;