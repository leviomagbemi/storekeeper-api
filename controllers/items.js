const Item = require('../models/item');
const Supplier = require('../models/supplier');

const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find()
      .populate('supplier', 'name email phone contactPerson')
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (error) {
    return next(error);
  }
};

const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      'supplier',
      'name email phone contactPerson'
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const existingItem = await Item.findOne({ sku: req.body.sku });

    if (existingItem) {
      return res.status(409).json({
        message: 'An item with this SKU already exists.'
      });
    }

    const supplier = await Supplier.findById(req.body.supplier);

    if (!supplier) {
      return res.status(400).json({ message: 'Referenced supplier does not exist.' });
    }

    const item = await Item.create(req.body);
    const populatedItem = await item.populate('supplier', 'name email phone contactPerson');

    return res.status(201).json(populatedItem);
  } catch (error) {
    return next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    if (req.body.sku) {
      const existingItem = await Item.findOne({
        sku: req.body.sku,
        _id: { $ne: req.params.id }
      });

      if (existingItem) {
        return res.status(409).json({
          message: 'An item with this SKU already exists.'
        });
      }
    }

    if (req.body.supplier) {
      const supplier = await Supplier.findById(req.body.supplier);

      if (!supplier) {
        return res.status(400).json({ message: 'Referenced supplier does not exist.' });
      }
    }

    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('supplier', 'name email phone contactPerson');

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    return res.status(200).json({ message: 'Item deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
