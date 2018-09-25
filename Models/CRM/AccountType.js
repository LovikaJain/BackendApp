var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AccountType', 
new Schema({
    name: {type: String, required: true},
    order:{type: Number, required: true},
    createdAt: {type: Date, default: Date.now}
}));

