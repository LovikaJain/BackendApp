'use strict';



AccountRoute = require('./CRM/AccountRoute.js'),
QuoteNoteRoute = require('./CRM/QuoteNoteRoute'),
AccountNoteRoute = require('./CRM/AccountNoteRoute.js'),

var all = [].concat(AccountRoute,AccountNoteRoute, QuoteNoteRoute);

module.exports = all;
