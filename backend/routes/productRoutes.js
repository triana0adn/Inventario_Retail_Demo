const express = require('express');
const Product = require('../models/product');
const router = express.Router();

//obtiene todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//crea el producto
router.post('/', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//actualiza por sku
router.put('/:sku', async (req, res) => {
  try {
    const { name, price, stock } = req.body;

    //validaciones
    if (!name || !price || stock == null) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    if (price < 0) {
      return res.status(400).json({ message: 'El precio no puede ser negativo' });
    }
    if (stock < 0) {
      return res.status(400).json({ message: 'El stock no puede ser negativo' });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { sku: req.params.sku },
      { name, price, stock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

//Elimina por el id en mongodb
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;




