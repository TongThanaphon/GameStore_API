const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Stock = require('../models/stock');

router.post('/create', (req, res, next) => {
    const stock = new Stock({
        _id: new mongoose.Types.ObjectId(),
        itemId: req.body.itemId,
        quantity: req.body.quantity,
        type: req.body.type
    });

    stock
    .save()
    .then(result => {
        res.status(201).json({
            message: 'Stock created',
            createStock: {
                _id: result._id,
                itemId: result.itemId,
                quantity: result.quantity,
                type: result.type
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/', (req, res, next) => {
    Stock.find()
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            stocks: docs.map(doc => {
                return {
                    _id: doc._id,
                    itemId: doc.itemId,
                    quantity: doc.quantity,
                    type: doc.type
                };
            })
        };
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/findById/:itemId', (req, res, next) => {
    const id = req.params.itemId;
    Stock.find({ itemId: id})
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json({
                stock: doc
            });
        }else{
            res.status(404).json({
                message: 'Item id ' + id + ' does not exist'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/findByStockId/:stockId', (req, res, next) => {
    const id = req.params.stockId;

    Stock.find({ _id : id })
    .exec()
    .then(doc => {
        res.status(200).json({
            stock: doc
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/update/:stockId', (req, res, next) => {
    const id = req.params.stockId;
    const updateOps = {};

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    
    Stock.update({ _id: id }, {$set: updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Stock id ' + id + ' updated'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/delete/:stockId', (req, res, next) => {
    const id = req.params.stockId;
    Stock.remove({ _id: id })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Stock id ' + id + ' deleted'
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;