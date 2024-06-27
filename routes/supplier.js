const express = require('express');
const router = express.Router();
const Supplier = require('../models/supplier');
const { authenticate, authorize } = require('../middleware/auth');

// Endpoint to add a new supplier
router.post('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const newSupplier = await Supplier.create({ supplierName, contactName, address, city, postalCode, country, phone });
        res.status(201).json(newSupplier);
    } catch (err) {
        next(err);
    }
});

// Endpoint to get all suppliers
router.get('/', authenticate, async (req, res, next) => {
    try {
        const suppliers = await Supplier.findAll();
        res.json(suppliers);
    } catch (err) {
        next(err);
    }
});

// Endpoint to get a supplier by ID
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        next(err);
    }
});

// Endpoint to update a supplier by ID
router.put('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { supplierName, contactName, address, city, postalCode, country, phone } = req.body;
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            supplier.supplierName = supplierName;
            supplier.contactName = contactName;
            supplier.address = address;
            supplier.city = city;
            supplier.postalCode = postalCode;
            supplier.country = country;
            supplier.phone = phone;
            await supplier.save();
            res.json(supplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        next(err);
    }
});

// Endpoint to delete a supplier by ID
router.delete('/:id', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if (supplier) {
            await supplier.destroy();
            res.json({ message: 'Supplier deleted' });
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
