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

Get_Quote = {
    handler: function (request, reply) {
        Controller.QuoteNoteController.get(request.params, function (err, success) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
            }
        });
    },
    config: {
        description: 'Get All Notes of Quotes',
        tags: ['api', 'account-quotes-notes'],
        validate: {
            // headers: UniversalFunctions.authorizationHeaderObj,
            params: {
                accountId: Joi.string().optional().trim(),
                quote_id: Joi.string().required().trim(),
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
}

Post_Quote = {
    handler: function (request, reply) {
        Controller.QuoteNoteController.save(request, function (err, success) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
            }
        });
    },
    config: {
        description: 'Add New Note to Quotes',
        tags: ['api', 'account-quotes-notes'],
        validate: {
            // headers: UniversalFunctions.authorizationHeaderObj,
            payload: payloadValidation,
                params: {
                accountId: Joi.string().optional().trim(),
                quote_id: Joi.string().required().trim()
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

Put_Quote = {
    handler: function (request, reply) {
        // Note Doesn't Update Year and Model in DB
        Controller.QuoteNoteController.save(request, function (err, success) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
            }
        });
    },
    config: {
        description: 'Update notes in a quote',
        tags: ['api', 'account-quotes-notes'],
        validate: {
            // headers: UniversalFunctions.authorizationHeaderObj,
            payload: payloadValidation,
            params: {
                accountId: Joi.string().optional().trim(),
                quote_id: Joi.string().required().trim(),
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

Delete_Quote = {
    handler: function (request, reply) {
        Controller.QuoteNoteController.delete(request.params, function (err, success) {
            if (err) {
                reply(UniversalFunctions.sendError(err));
            } else {
                reply(UniversalFunctions.sendSuccess(APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success)).code(200);
            }
        });
    },
    config: {
        description: 'Delete notes from quote',
        tags: ['api', 'account-quotes-notes'],
        validate: {
            // headers: UniversalFunctions.authorizationHeaderObj,
            params: {
                accountId: Joi.string().optional().trim(),
                quote_id: Joi.string().required().trim(),
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

module.exports = [
    {
        method: 'GET',
        path: '/api/quotes/{quote_id}/notes/{_id?}',
        handler: Get_Quote.handler,
        config: Get_Quote.config  
    },
    {
        method: 'GET',
        path: '/api/accounts/{accountId}/quotes/{quote_id}/notes/{_id?}',
        handler: Get_Quote.handler,
        config: Get_Quote.config  
    },
    {
        method: 'POST',
        path: '/api/quotes/{quote_id}/notes',
        handler: Post_Quote.handler,
        config: Post_Quote.config   
    },
    {
        method: 'POST',
        path: '/api/accounts/{accountId}/quote/{quote_id}/notes',
        handler: Post_Quote.handler,
        config: Post_Quote.config   
    },
    {
        method: 'PUT',
        path: '/api/quotes/{quote_id}/notes/{_id}',
        handler: Put_Quote.handler,
        config: Put_Quote.config
    },
    {
        method: 'PUT',
        path: '/api/accounts/{accountId}/quotes/notes/{_id}',
        handler: Put_Quote.handler,
        config: Put_Quote.config
    },
    {
        method: 'DELETE',
        path: '/api/quotes/{quote_id}/notes/{_id}',
        handler: Delete_Quote.handler,
        config: Delete_Quote.config
    },
    {
        method: 'DELETE',
        path: '/api/accounts/{accountId}/quotes/notes/{_id}',
        handler: Delete_Quote.handler,
        config: Delete_Quote.config
    }
]
