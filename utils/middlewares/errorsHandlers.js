const Sentry = require("@sentry/node");
const Boom = require('@hapi/boom');
const debug = require('debug')('app:error');

const { config } = require('../../config/index');
const isRequestAjaxOrApi = require('../../utils/isRequestAjaxOrApi');

//Sentry.init({ dsn: `https://${config.sentryDns}/${config.sentryId}` });
Sentry.init({ dsn: `https://${config.sentryDns}/${config.sentryId}` });

function withErrorStack(err, stack){
    if(config.dev){
        return { ...err, stack } // Object.assign({}, err, stack)
    }
}

function logErrors(err, req, res, next){
    debug(err.stack);
    Sentry.captureException(err);
    //console.log('Error logErrors');
    next(err);
}

function wrapErrors(err, req, res, next){
    if(!err.isBoom){
        next(boom.badImplementation(err));
    }
    next(err);
}

function clientErrorHandler(err, req, res, next){
    const {
        output: { statusCode, payload}
    } = err;

    //catch errors for Ajax request or if an error ocurrs while streaming
    if ( isRequestAjaxOrApi(req) || res.headersSent){
        //console.log('Error clientErrorHandler');
        res.status(statusCode).json(withErrorStack(payload, err.stack));
    }else{
        next(err);
    }
}

function errorHandler(err, req, res, next){
    //catch errors while streaming
    const {
        output: { statusCode, payload}
    } = err;

    res.status(statusCode);
    res.render("error", withErrorStack(payload, err.stack));
}

module.exports = {
    logErrors,
    clientErrorHandler,
    errorHandler,
    wrapErrors,
}