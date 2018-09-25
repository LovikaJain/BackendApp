var Models = require('../../Models');

//Get Account Data from DB
var getOb = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.Account.find(criteria, projection, options, callback);
};

//Insert Account Data in DB
var createOb = function (objToSave, callback) {
    new Models.Account(objToSave).save(function(err, resp){
            if(err)
                return callback(err);
            callback(err, resp)
    })
};


//Update Data
var updateOb = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.Account.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Delete Account from DB
var deleteOb = function (criteria, callback) {
    Models.Account.remove(criteria, function(err, resp){
        if(err)
            return callback(err)
        
        if(resp.result.n === 0) 
            return callback(null, resp);
            callback(err, resp)
    });
};

module.exports = {
    get: getOb,
    create: createOb,
    update: updateOb,
    delete: deleteOb
};


