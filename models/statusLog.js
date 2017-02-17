'use strict';
var mongoose = require('mongoose'),
var Schema  = mongoose.Schema;


var statusLogSchema = new Schema({
   id: { type: String, ref: 'Status' },
    name: { type: String, default: '' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
});

module.exports = mongoose.model('StatusLog', statusLogSchema);