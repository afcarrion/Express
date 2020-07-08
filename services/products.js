const productMocks = require('../utils/mock/products');
const MongoLib = require('../lib/mongo');


class ProductsService{
    
    constructor(){
        this.collection = 'products',
        this.mongoDB = new MongoLib()
    }

    async getProducts({ tags }){
        const query = tags && { tags: { $in: tags }};
        const products  = await this.mongoDB.getAll(this.collection, query);
        return products || []; 
    }

    async getProduct({ productId }){
        const product = await this.mongoDB.get(this.collection, productId);
        return product || {};
        //return Promise.resolve(productMocks[0]);
    }

    async createProduct({ product }){
        const createProductId = await this.mongoDB.create(this.collection, product);
        return createProductId;
        //return Promise.resolve(productMocks[0]);
    }
    async updateProduct({ productId, product }){
        const updateProductId = await this.mongoDB.update(
            this.collection,
            productId,
            product
          );
      
        return updateProductId;
        //return Promise.resolve(productMocks[0]); 
    }
    async deleteProduct({ productId }){
        const deletedProductId = await this.mongoDB.delete(
            this.collection,
            productId
          );
          return deletedProductId;
        //return Promise.resolve(productMocks[0]);
    }

}

module.exports = ProductsService;