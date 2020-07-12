const express = require('express');
const { Router } = require('express');
const router = express.Router();
const ProductServices = require('../../services/products');
const { config } = require("../../config");

const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS } = require('../../utils/time'); 

const productServices = new ProductServices();


router.get('/',async  function(req, res, next){
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const { tags } = req.query;
    try{
        //throw new Error('This is a new Error');
        const products = await productServices.getProducts({ tags });
        res.render("products", { products, dev: config.dev });
    }catch(error){
        next(error);
    }
})

module.exports = router;