const express = require('express');
const passport = require('passport');
const ProductsService = require('../../services/products');

const validation =require('../../utils/middlewares/validationHandler');

const cacheResponse = require('../../utils/cacheResponse');
const { FIVE_MINUTES_IN_SECONDS, SIXTY_MINUTES_IN_SECONDS } = require('../../utils/time'); 

const { productIdSchema, 
        productTagSchema, 
        createProductSchema, 
        updateProductSchema } = require('../../utils/schemas/products');

//JWT strategy
require("../../utils/auth/strategies/jwt");

const productServices = new ProductsService();

function productsApi(app){

    const router = express.Router();
    app.use("/api/products", router);
    const productServices = new ProductsService();

    router.get('/', async function(req, res, next){
        cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
        const { tags } = req.query;
        try {
            //throw new Error('Error generado desde el API');
            const products = await productServices.getProducts({ tags});
        
            res.status(200).json({
                data: products,
                message: 'products listed',
            });
        } catch (error) {
            next(error);
        }
    });

    router.get('/:productId', async function(req, res, next){
        cacheResponse(res, SIXTY_MINUTES_IN_SECONDS);
        try {
            const { productId } = req.params;
            const product = await productServices.getProduct({ productId});
            res.status(200).json({
                data: product,
                message: 'Product retrieved'
            });
        } catch (error) {
            next(error);
        }
    });

    router.post('/',  validation(createProductSchema), async function(req, res, next){
        try{
            const { body:product } = req;
            const createProduct =await productServices.createProduct({ product});
        
            res.status(201).json({
                data: createProduct,
                message: 'products create',
            });
        }catch(error){
            next(error);
        }
    });

    router.put('/:productId', passport.authenticate("jwt", { session: false }), validation(productIdSchema, "req.params"), validation(updateProductSchema) ,async function(req, res, next){
        try {
            const { productId } = req.params;
            const { body: product } = req;
            const updateProduct = await productServices.updateProduct({ productId, product });
            res.status(200).json({
                data: updateProduct,
                message: 'Product Update'
            });
        } catch (error) {
            next(error);
        }
    });

    router.delete('/:productId', passport.authenticate("jwt", { session: false }), async function(req, res, next){
        try {
            const { productId } = req.params;
            const product = productServices.deleteProduct({ productId }); 
        
            res.status(200).json({
                data: product,
                message: 'Product Delete',
            });
            
        } catch (error) {
            next(error);
        }
    });
}
module.exports = productsApi;