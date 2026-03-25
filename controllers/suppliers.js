const Supplier = require('../models/supplier');

const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    return res.status(200).json(suppliers);
  } catch (error) {
    return next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    return res.status(200).json(supplier);
  } catch (error) {
    return next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const existingSupplier = await Supplier.findOne({
      email: req.body.email.toLowerCase()
    });

    if (existingSupplier) {
      return res.status(409).json({
        message: 'A supplier with this email already exists.'
      });
    }

    const supplier = await Supplier.create(req.body);
    return res.status(201).json(supplier);
  } catch (error) {
    return next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    if (req.body.email) {
      const existingSupplier = await Supplier.findOne({
        email: req.body.email.toLowerCase(),
        _id: { $ne: req.params.id }
      });

      if (existingSupplier) {
        return res.status(409).json({
          message: 'A supplier with this email already exists.'
        });
      }
    }

    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    return res.status(200).json(supplier);
  } catch (error) {
    return next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    return res.status(200).json({ message: 'Supplier deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
};
