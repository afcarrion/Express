const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const productsRouter = require('./routes/views/products');
const productsApiRouter = require('./routes/api/products');
const { logErrors, wrapErrors, clientErrorHandler, errorHandler } = require('./utils/middlewares/errorsHandlers');
const  isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi');
const Boom  = require('@hapi/boom');

//app
const app = express();

//Middleware
app.use(bodyParser.json());

//Static Files
app.use("/static", express.static(path.join(__dirname, "public")));

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");


//Routes
app.use('/products', productsRouter);
app.use('/api/products', productsApiRouter);

//redirect
app.get('/', function(req, res){
    res.redirect('/products');
});

app.use(function(req, res, next){
    if(isRequestAjaxOrApi(req)){
        const {
            output: { statusCode, payload }
        } = Boom.notFound();
        res.status(statusCode).json(payload);
    }

    res.status(404).render("404");

})

//errorHandler
app.use(logErrors);
app.use(wrapErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


//server
const server = app.listen(8000, function(){
    console.log(`Listening http://localhost:${server.address().port}`);
});