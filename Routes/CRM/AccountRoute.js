var Controller = require('../../Controllers'),
UniversalFunctions = require('../../Utils/UniversalFunctions'),
Joi = require('joi'),
APP_CONSTANTS = require('../../Config/appConstants'),
_ = require('lodash');

var payloadValidation = {
    _id:Joi.string().optional(),
    accountContactId: Joi.string().optional(),
    primaryContactId: Joi.string().optional(),
    contacts:Joi.array().items([]),
    statusId:Joi.string().optional(),
    stageId:Joi.string().optional(),
    typeId:Joi.string().optional(),
    cars_per_year:Joi.number().optional(),
    notes:Joi.array().items([{
        content:Joi.string().allow(''),
        creator:Joi.object().keys({
            _id:Joi.string().optional(),    
            name: Joi.string().optional()
        }),
        createdAt:Joi.string().optional().allow('')
    }]),
    creator:Joi.object().keys(
        {
            _id:Joi.string().optional(),
            name:Joi.string().optional()
        }
    ),
    assignee:Joi.object().keys(
        {
            _id:Joi.string().optional(),
            name:Joi.string().optional()
        }
    ),
    description:Joi.string().optional(),
    createdAt:Joi.date().optional(),
    deletedAt: Joi.date().optional()     
}

module.exports = [
    {
        method: 'GET',
        path: '/api/accounts/{_id?}',
        handler: function (request, reply) {
            Controller.AccountController.get(request.params, request.query, function (err, success) {
                console.log(request.params);
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Get All Accounts',
            tags: ['api', 'accounts'],
            validate: {
                params: {
                    _id: Joi.string().optional().trim()
                },
                query:{
                    limit: Joi.number().min(1).max(1000).optional(),
                    direction: Joi.string().optional(),
                    sort: Joi.string().optional()
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
        path: '/api/accounts',
        handler: function (request, reply) {
            Controller.AccountController.save(request, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Add New Account',
            tags: ['api', 'accounts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                payload: payloadValidation,
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
        path: '/api/accounts/{_id}',
        handler: function (request, reply) {
            // Note Doesn't Update Year and Model in DB
            Controller.AccountController.save(request, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Update Account',
            tags: ['api', 'accounts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                payload: payloadValidation,
                params: {
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
        path: '/api/accounts/{_id}',
        handler: function (request, reply) {
            Controller.AccountController.delete(request.params, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Delete Account',
            tags: ['api', 'accounts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                params: {
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
        method: 'POST',
        path: '/api/accounts/all',
        handler: function (request, reply) {
            Controller.AccountController.get(request.headers.authorization, request.params, function (err, success) {
                if (err) {
                    reply(UniversalFunctions.sendError(err));
                } else {
                    reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
                }
            });
        },
        config: {
            description: 'Get All Accounts',
            tags: ['api', 'accounts'],
            validate: {
                // headers: UniversalFunctions.authorizationHeaderObj,
                params: {
                    _id: Joi.string().optional().trim()
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    responseMessages: APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
]
