const express = require('express');
const router = express.Router();
const ProductServices = require('../../services/products');
const ProductsService = require('../../services/products');

const productServices = new ProductsService();

router.get('/', async function(req, res, next){
    const { tags } = req.query;
    try {
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

router.post('/',async function(req, res, next){
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

router.put('/:productId',async function(req, res, next){
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

router.delete('/:productId', function(req, res, next){
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

module.exports = router;