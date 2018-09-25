var mongoose = require('mongoose');
var softDelete = require('mongoose-delete');
var Schema = mongoose.Schema;

var User = {
    _id: {type: Schema.ObjectId, ref: 'Admin'},
    name: {type: String, ref: 'Admin'}
};

var Note = new Schema({
    content: {type: String, trim: true, required: true},
    creator: User,
    createdAt: {type: Date, default: Date.now},
    followUp : {type:Date}
});

var History = new Schema({
    eventType: String,
    action:String,
    creator: User,
    createdAt: {type: Date, default: Date.now}
});

var Account = new Schema({
        accountContactId: {type: Schema.ObjectId, ref: 'AccountContact'},
        primaryContactId: {type: Schema.ObjectId, ref: 'AccountContact'},
        contacts: [{type: Schema.ObjectId, ref: 'AccountContact'}],
        statusId: {type: Schema.ObjectId, ref: 'AccountStatus'},
        stageId: {type: Schema.ObjectId, ref: 'AccountStatusStage'},
        typeId: {type: Schema.ObjectId, ref: 'AccountType'},
        cars_per_year:Number,
        notes:[Note],
        history:[History],
        creator: User,
        assignee: User,
        createdAt: {type: Date, default: Date.now},
        description:{type:String, default:""},
        deletedAt : {type: Date}
    });

module.exports = Account.plugin(softDelete,{ overrideMethods: true});
module.exports = mongoose.model('Account', Account);

