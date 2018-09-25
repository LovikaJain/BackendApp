'use strict'

var Services = require('../../Services'),
Controller = require('../../Controllers'),
Models = require('../../Models'),
UniversalFunctions = require('../../Utils/UniversalFunctions'),
async = require('async'),
mongoose = require('mongoose'),
moment = require('moment'),
Config = require('../../Config'),
_ = require('underscore');
var NotificationManager = require('../../Lib/NotificationManager');

var getQuote = function(params, query, callbackRoute){
        var criteria = {};

        if(params._id)
            criteria._id = params._id;
        var projection = {};
        var options = {};

        if(Object.hasOwnProperty.call(query,"status")){
            criteria.status = query.status;         
        }

            Services.QuoteService.get(criteria, projection, options, function (err, data) {                
                if (err) {
                    callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_QUOTES_FOUND);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data)
                    data = params._id? data[0]:data;  
                    callbackRoute(null, data);
                } else {
                    callbackRoute(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_QUOTES_FOUND);
                }
            });
}

/*
 ----------------------------------------
 Save Quote
 ----------------------------------------
 */
var saveQuote = function (req, callbackRoute) {
    var payloadData = req.payload;
    var creatordata = req.auth.credentials;
        if(req.params.accountId){
            payloadData.accountId = req.params.accountId;
        }
            var projection = {};
            var options = {limit: 1};
            if(req.params._id){
                Services.QuoteService.update({_id:req.params._id}, payloadData, {},  function (err, dataFromDB) {
                    if (err) {
                        callbackRoute(err)
                    } else {
                        callbackRoute(err, dataFromDB)
                    }
                })
            }else{
                if(creatordata)
                    payloadData.creator = {_id: creatordata[0]._id, name: creatordata[0].name};
                payloadData.history = {eventType: "Quote", action: "New Quote", creator: payloadData.creator};
                Services.QuoteService.create(payloadData, function (err, resp) {
                    if (err) {
                        callbackRoute(err)
                    } else {
                        NotificationManager.sendEmailToUser('NEW_LEAD_MAIL', buildEmailData(resp), Config.APP_CONSTANTS.SERVER.SALES_EMAIL, function(err,resp){
                            if(err) return callback(err);
                            
                            console.log('Sales were notified!');
                        })
                        callbackRoute(err, resp)
                    }
                });
            }
        }

 /*
 ----------------------------------------
 Delete Quote
 ----------------------------------------
 */
var deleteQuote = function(params, callbackRoute){
            var criteria = {
                _id: params._id
            };
            Services.QuoteService.delete(criteria,function(err,resp){
                if(err){
                    callbackRoute(err)
                } else {
                    if (resp.n === 1)
                        callbackRoute(null,{})  
                       }
               
            })
        }

/*
----------------------------------------------
Mail
----------------------------------------------
*/
var mailQuote =  function(req, params, callbackRoute){
    var creatordata = req.auth.credentials;
    var criteria = {};
    criteria._id = params._id;
    var projection = {};
    var options = {};
    async.waterfall([
        function (callback) {
            var criteria = {};
            criteria._id = params._id;
            var projection = {};
            var options = {};
            // get the data by Quote _id
            Services.QuoteService.get(criteria, projection, options, function (err, data) {                
                if (err) {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_QUOTES_FOUND);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data)
                    data = params._id? data[0]:data;  
                    callback(null, data);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_QUOTES_FOUND);
                }
            });
        },
        function (quoteData, callback) {
                NotificationManager.sendEmailToUser('QUOTE_MAIL', buildEmailData(quoteData), quoteData.email, function(err,resp){
                    if(err)
                        return callback(err);
                    
                    var origin = quoteData.origin.city + ', ' + quoteData.origin.state + (quoteData.origin.zip?', '+ quoteData.origin.zip:'');
                    var destination = quoteData.destination.city + ', ' + quoteData.destination.state + (quoteData.destination.zip?', '+ quoteData.destination.zip:'');
                    var creator = creatordata? {_id: creatordata[0]._id, name: creatordata[0].name}: {};
                    var history = {eventType: "Quote", action: "Quote Mail", content: "The price to ship the vehicle" + " "  + quoteData.model + " " + quoteData.make + " " + quoteData.year + " " + (quoteData.isEnclosed?"Enclosed":"Open") + " " + "from" + " " +  origin + " " + "to" + " " + destination + " " + "is $" + " " + quoteData.price, creator: creator};
                    Services.QuoteService.update({_id:req.params._id}, {$push: {'history': history}}, {},  function (err, dataFromDB) {
                            if (err) {
                            callback(err)
                        } else {
                            return callback(null, dataFromDB)
                        }
                    })
                    
                });    
        
    }
    ], function (error, result) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {message:"Email was successfully sent to" + " " + result.email + " " + "by" + " " + result.name });
        }
    })
}

var smsQuote = function(req, params, callbackRoute){
    var creatordata = req.auth.credentials;
    var criteria = {};
    criteria._id = params._id;
    var projection = {};
    var options = {};
    async.waterfall([
        function (callback) {
            var criteria = {};
            criteria._id = params._id;
            var projection = {};
            var options = {};
            // get the data by Quote _id
            Services.QuoteService.get(criteria, projection, options, function (err, data) {                
                if (err) {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_QUOTES_FOUND);
                } else if (data && data.length > 0 && data[0]._id) {
                    if(data)
                    data = params._id? data[0]:data;  
                    callback(null, data);
                } else {
                    callback(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.NO_QUOTES_FOUND);
                }
            });
        },
        function (quoteData, callback) {
            smsData(quoteData);
                NotificationManager.sendSMSToUser(quoteData.phone, smsData(quoteData) , function(err, resp){
                    if(err){
                        callback(err);
                    }
                    else{
                        var origin = quoteData.origin.city + ', ' + quoteData.origin.state + (quoteData.origin.zip?', '+ quoteData.origin.zip:'');
                        var destination = quoteData.destination.city + ', ' + quoteData.destination.state + (quoteData.destination.zip?', '+ quoteData.destination.zip:'');
                        var creator = creatordata? {_id: creatordata[0]._id, name: creatordata[0].name}: {};
                        var history = {eventType: "Quote", action: "Quote SMS", content: "The price to ship the vehicle" + " "  + quoteData.model + " " + quoteData.make + " " + quoteData.year + " " + (quoteData.isEnclosed?"Enclosed":"Open") + " " + "from" + " " +  origin + " " + "to" + " " + destination + " " + "is $" + " " + quoteData.price, creator: creator};
                        Services.QuoteService.update({_id:req.params._id}, {$push: {'history': history}}, {},  function (err, dataFromDB) {
                                if (err) {
                                callback(err)
                            } else {
                                return callback(null, dataFromDB)
                            }
                        })
                    }
                })
    }
    ], function (error, result) {
        if (error) {
            callbackRoute(error);
        } else {
            callbackRoute(null, {message:"SMS was successfully sent to" + " " + result.phone + " " + "by" + " " + result.name });
        }
    })
}

var smsData = function(quote) {
    return {
        vehicleList:  quote.make + " " + quote.model + " "  + quote.year ,
        userName: quote.name,
        pickupDetails: quote.origin.city + ', ' + quote.origin.state + (quote.origin.zip?', '+ quote.origin.zip:''),
        dropDetails: quote.destination.city + ', ' + quote.destination.state + (quote.destination.zip?', '+ quote.destination.zip:''),
        tariff: UniversalFunctions.priceWithDecimal(quote.price)
    }  
}
var buildEmailData = function(quote){
    return {
        vehicleList: quote.year + " " + quote.make + " " + quote.model,
        quoteNumber: quote.quoteNumber,
  
        userPhone: quote.phone,
        userEmail: quote.email,
        pickupDetails: quote.origin.city + ', ' + quote.origin.state + (quote.origin.zip?', '+ quote.origin.zip:''),
        dropDetails: quote.destination.city + ', ' + quote.destination.state + (quote.destination.zip?', '+ quote.destination.zip:''),
        tariff: UniversalFunctions.priceWithDecimal(quote.price),
        vehicleCondition: quote.isOperable == 'true'? 'Running': 'Not Running',
        transportType: quote.isEnclosed? 'Enclosed':'Open',
        companyName: "Diesel Dispatch",
        companyPhoneTollfree: "360.539.8600",
        originUrl: quote.originUrl,
        quoteEmail: Config.APP_CONSTANTS.SERVER.QUOTES_EMAIL
    }
}

module.exports = {
    get:getQuote,
    save: saveQuote,
    delete:deleteQuote,
    mail:mailQuote,
    sms: smsQuote
}
