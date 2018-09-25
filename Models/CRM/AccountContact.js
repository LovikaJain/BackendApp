var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Phone = new Schema({
    type: String,
    number: String,
    createdAt: {type: Date, default: Date.now}
});
var Email = new Schema({
    type: String,
    email: String,
    createdAt: {type: Date, default: Date.now}
})
var History = new Schema({
    field: String,
    value: String,
    createdAt: {type: Date, default: Date.now}
});

var Address = new Schema({
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zip: String,
});


module.exports = mongoose.model('AccountContact', 
new Schema({
    name: String,
    title: String,
    type: {type: Schema.ObjectId, ref: 'Type'},
    emails: [Email],
    addresses:[Address],
    phones:[Phone],
    history:[History],
    createdAt: {type: Date, default: Date.now}
}));

