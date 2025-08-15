var mongoose = require('mongoose');

var ContentSchema = new mongoose.Schema({
  date: String,
  content: String,
  title: String,
});

var Content = mongoose.model('Content', ContentSchema);

module.exports = Content;


