var mongoose = require('mongoose');

var DonationSchema = new mongoose.Schema({
  amount: {type: String},
  _user: {type: String, ref: 'User'},
  _charity: {type: String, ref: 'Charity'},
  date: {type : Date, default: Date.now},
  receiptNumber: {type: String, unique: true}
});

mongoose.model('Donation', DonationSchema);
