var crypto = require('crypto');
var mongoose = require('mongoose');


var InviteSchema = new mongoose.Schema({
  inviteCode: {type: String, unique: true}
});

InviteSchema.methods.setInviteCode = function() {
  // 0.9697340672104935 ->  Math.random
  this.inviteCode = (Math.random() * 1000).toString().split(".")[0] +
      crypto.randomBytes(5).toString('hex').toUpperCase();
};

mongoose.model('Invite', InviteSchema);
