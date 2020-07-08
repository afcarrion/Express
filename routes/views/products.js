const express = require('express');
const { Router } = require('express');
const router = express.Router();
const ProductServices = require('../../services/products');


const productServices = new ProductServices();


router.get('/',async  function(req, res, next){
    const { tags } = req.query;
    try{
        const products = await productServices.getProducts({ tags });
        res.render("products", { products });
    }catch(error){
        next(error);
    }
})

module.exports = router;