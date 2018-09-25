var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('AccountStatusStage', 
new Schema({
    name: String,
    order: Number,
    statusId: {type: Schema.ObjectId, ref: 'AccountStatus'},
    createdAt: {type: Date, default: Date.now}
}));
