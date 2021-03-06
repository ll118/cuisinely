const mongoose = require('mongoose');
const ifeedme = require('../config');
mongoose.Promise = require('bluebird');

userSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: { unique: true }},
  bookmarks: { type: [] },
  points: {type: Number },
  pointsGraph: { type: []},
  level: { type: Number },
  weeklyPoints: { type: {} }
});

var User = mongoose.model('User', userSchema);
module.exports = User;
