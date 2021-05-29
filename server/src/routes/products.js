import {
    Router
} from 'express';
import db from './../database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/', (req, res) => {
    let products = db.get('products');
    const limit = +req.query.limit;

    if(limit) {
        products = db.get('products').sort((a, b) => a.id - b.id).slice(0, limit);
    }

    return res.status(200).json(products)

}).get('/:productId', (req, res) => {
    const {
        productId
    } = req.params;

    let product = db.get('products').find({id: +productId}).value();
    if (!product) {
        return res.status(404).json({status: 'failed', error: 'Not Found', message: `Product with ${productId} ID doesn't exist in DB`});
    }

    return res.status(200).json(product)
}).get('/category/:categoryName', (req, res) => {
    const {
        categoryName
    } = req.params;

    let products = db.get('products').filter(e => e.category === `${categoryName}`);

    if(products.length === 0) {
        return res.status(404).json({status: 'failed', error: 'Not Found', message: `Products with ${categoryName} Category doesn't exist in DB`})
    }

    return res.status(200).json(products)
}).post('/', (req, res) => {
    let product = req.body;

    let id = uuidv4();

    db.get('products')
    .push({...product, id})
    .write()

    res.status(200).json({ status: 'success'});

}).delete('/:productId', (req, res) => {
    const { productId } = req.params;
    
    const productsForRemoving = db.get('products').remove({id: +productId});
    
    if(productsForRemoving.value().length) {
        productsForRemoving.write();
        return res.status(200).json({ status: 'success'});
    }
    return res.status(404).json({status: 'failed', error: 'Not Found', message: `Product with ${productId} ID doesn't exist in DB`});

}).put('/:productId', (req, res) => {
    const {
        productId
    } = req.params;

    let product = req.body;

    const productsForRemoving = db.get('products').remove({id: +productId});

    if(productsForRemoving.value().length) {
        productsForRemoving.write();
        db.get('products').push({ id: +productId,...product}).write()
        let newProduct = db.get('products').find({id: +productId}).value()
        return res.status(200).json(newProduct);
    }

    return res.json({
        status: "error",
        message: "something went wrong! check your sent data",
    });
})

export default router;