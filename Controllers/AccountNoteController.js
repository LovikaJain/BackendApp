'use strict'

const Services = require('../../Services'),
Controller = require('../../Controllers'),
UniversalFunctions = require('../../Utils/UniversalFunctions'),
async = require('async'),
moment = require('moment'),
mongoose = require('mongoose'),
Config = require('../../Config'),
_ = require('underscore');


const MODEL_FIELD = 'notes'
const MODEL_FIELD_ID = 'notes._id'

var getOb = function(params, callbackRoute){
            var projection = {};
            var options = {limit: 1};
            let criteria = {
                '_id': params.account_id,
            }
            if(params._id)
                criteria[MODEL_FIELD_ID] = params._id

            var projection = {};
            var options = {};
            Services.AccountService.get(criteria, projection, options, function (err, data) {
                if (err) {
                    callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_ObS_FOUND);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data){
                        data = data[0];  
                        data = data[MODEL_FIELD] || [];
                        
                        if(params._id)
                            data = _.find(data, function(item){ 
                                return item._id.toString() == params._id
                            });
                    }
                    callbackRoute(null, data);
                } else {
                    callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_ObS_FOUND);
                }
            });
        }


/*
 ----------------------------------------
 Save Ob
 ----------------------------------------
 */
var saveOb = function (req, callbackRoute) {
    var ob = req.payload;
    var creatordata = req.auth.credentials;
            var projection = {};
            var options = {limit: 1};
                let criteria = {
                    '_id': req.params.account_id,
                }
                // Create New
                if(req.params._id){
                    let field, set = {}
                    
                    criteria[MODEL_FIELD_ID] = req.params._id
                
                    for (field in ob)
                        set[MODEL_FIELD + '.$.' + field] = ob[field];

                    Services.AccountService.update(criteria, { $set: set }, { new:true }, function(err, resp){
                        if(err)
                            callbackRoute(err);
                            
                            if(resp)   
                            resp = resp[MODEL_FIELD] || [];
                        ob = _.find(resp, function(item){ 
                            return item._id.toString() == ob._id
                        });
                        ob = ob || {};
                        callbackRoute(null, ob);
                    });
                }else{
                    ob._id = mongoose.Types.ObjectId().toString();
                    var creator = {_id: creatordata[0]._id, name: creatordata[0].name};
                    var history = {eventType:"Note", action:"New Note",'creator': creator};
                    Services.AccountService.update(
                        criteria, {$push: {'notes': ob,'history': history}}, {new:true},  function(err, resp){
                            if(err) 
                                callbackRoute(err);
                            
                            if(resp)   
                            resp = resp[MODEL_FIELD] || [];
                            ob = _.find(resp, function(item){ 
                                return item._id.toString() == ob._id
                            });
                            ob = ob || {};
                            callbackRoute(null, ob);
                    });
                }
        }

 /*
 ----------------------------------------
 Delete Ob
 ----------------------------------------
 */
var deleteOb = function(params, callbackRoute){
            var projection = {};
            var options = {limit: 1};
            var criteria = {
                'notes._id': params._id
            };

            Services.AccountService.update(criteria, {
                $pull:{
                    notes:{_id:params._id}
                }}, function(err, resp){
                    if(!resp) 
                        return callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ID_NOT_FOUND);
                        console.log(err, resp);
                        callbackRoute(null, {});
            });           
        }

module.exports = {
    get:getOb,
    save: saveOb,
    delete:deleteOb
}
