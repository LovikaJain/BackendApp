'use strict'

var Services = require('../../Services'),
Controller = require('../../Controllers'),
Models = require('../../Models'),
UniversalFunctions = require('../../Utils/UniversalFunctions'),
async = require('async'),
moment = require('moment'),
Config = require('../../Config'),
_ = require('underscore');

var getOb = function(params,query, callbackRoute){
            let criteria = {};
            var projection = {};
            if (Object.getOwnPropertyNames(query).length === 0){
                projection = {};
            } else if (Object.hasOwnProperty.call(query,"limit")){
               projection.sort = query.sort;
               projection.direction = query.direction;
               projection.limit = query.limit;
            } else {
                projection.sort = query.sort;
                projection.direction = query.direction;
            }
    
            if(params._id){
                criteria._id = params._id;
            }
           
            var options = {}; 
            let account, contactAccount, contactPrimary, insert = false;
            var pop = ['accountContactId', 'primaryContactId', 'statusId', 'typeId', 'stageId'];

            Services.AccountService.getPopulate(criteria, projection, options, pop, function (err, data) {                
                if (err) {
                    callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_VEHICLES_FOUND);
                } else if (data && data.length > 0 && data[0]._id) {
                    
                    if(data)
                    data = params._id? data[0]:data;  
                    callbackRoute(null, data);
                } else {
                    callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_VEHICLES_FOUND);
                }
            });
}

/*
 ----------------------------------------
 Save Vehicle
 ----------------------------------------
 */
var saveOb = function (req, callbackRoute) {
    var payloadData = req.payload;
    var creatordata = req.auth.credentials;
            var projection = {};
            var options = {limit: 1};
            if(req.params._id){
                Services.AccountService.update({_id:req.params._id}, payloadData, {},  function (err, dataFromDB) {
                    if (err) {
                        callbackRoute(err)
                    } else {
                        callbackRoute(err, dataFromDB)
                    }
                })
            }else{
                payloadData.creator = {_id: creatordata[0]._id, name: creatordata[0].name};
                payloadData.history = {eventType: "Account", action: 'New Account', creator: payloadData.creator};
                Services.AccountService.create(payloadData, function (err, dataFromDB) {
                    if (err) {
                        callbackRoute(err)
                    } else {
                        callbackRoute(err, dataFromDB)
                    }
                })
            }
        }

 /*
 ----------------------------------------
 Delete Vehicle
 ----------------------------------------
 */
var deleteOb = function(params, callbackRoute){
            var criteria = {
                _id: params._id
            };
            // var date = Date.now();
            Services.AccountService.delete(criteria,function(err,resp){
                if(err){
                    callbackRoute(err)
                } else {
                    if (resp.n === 1)
                            // return callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ID_NOT_FOUND);
                        callbackRoute(null,{})  
                       }
               
            })

            // var date = Date.now();
            // Services.AccountService.delete(criteria, {$push: {'deletedAt': date}},function (err, resp) {
            //     if (err) {
            //         callbackRoute(err)
            //     } else {
            //         // TODO: Update Order
            //             callbackRoute(null, resp);
            //     }
            // })
            // Services.AccountService.delete(criteria, function (err, resp) {
            //     if (err) {
            //         callbackRoute(err)
            //     } else {
            //         // TODO: Update Order
            //         if(resp.result.n === 0) 
                        // return callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.ID_NOT_FOUND);
            //             callbackRoute(null, {});
            //     }
            // })
            
        }

module.exports = {
    get:getOb,
    save: saveOb,
    delete:deleteOb
}
