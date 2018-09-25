var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AccountStatus', 
new Schema({
    name: {type: String, default: ""},
    order:Number,
    createdAt: {type: Date, default: Date.now}
}));

