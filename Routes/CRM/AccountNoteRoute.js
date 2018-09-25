var Controller = require('../../Controllers');
var UniversalFunctions = require('../../Utils/UniversalFunctions');
var BaseJoi = require('joi'); var Extension = require('joi-date-extensions'); var Joi = BaseJoi.extend(Extension);
var APP_CONSTANTS = require('../../Config/appConstants');
var _ = require('lodash');


var payloadValidation = {
    _id:Joi.string().optional(),
    content: Joi.string().required().allow(''),
    creator: Joi.object().keys({
        _id:Joi.string().required(), 
        name: Joi.string().required()
    }).required(),
    followUp : Joi.string().optional(),
    createdAt: Joi.string().optional()
}   

module.exports = [
    {
        method: 'GET',
        path: '/api/accounts/{account_id}/notes/{_id?}',
        handler: function (request, reply) {
            Controller.AccountNoteController.get(request.params, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Get All Order Vehicles',
            tags: ['api', 'account-contacts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                params: {
                    account_id: Joi.string().required().trim(),
                    _id: Joi.string().optional().trim()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            auth: {
                strategy: 'bearer',
                scope: 'user'
                },
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/accounts/{account_id}/notes',
        handler: function (request, reply) {
            Controller.AccountNoteController.save(request, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Add New Vehicle to Order',
            tags: ['api', 'account-contacts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                payload: payloadValidation,
                    params: {
                    account_id: Joi.string().required().trim()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            auth: {
                strategy: 'bearer',
                scope: 'user'
                },
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/accounts/{account_id}/notes/{_id}',
        handler: function (request, reply) {
            // Note Doesn't Update Year and Model in DB
            Controller.AccountNoteController.save(request, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Update Vehicle in an Order',
            tags: ['api', 'account-contacts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                payload: payloadValidation,
                params: {
                    account_id: Joi.string().required().trim(),
                    _id: Joi.string().required().trim()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            auth: {
                strategy: 'bearer',
                scope: 'user'
                },
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/accounts/{account_id}/notes/{_id}',
        handler: function (request, reply) {
            Controller.AccountNoteController.delete(request.params, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Delete Vehicle from Order',
            tags: ['api', 'account-contacts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                params: {
                    account_id: Joi.string().required().trim(),
                    _id: Joi.string().required().trim()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            auth: {
                strategy: 'bearer',
                scope: 'user'
                },
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    }
]
