const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// SELL PRODUCT
router.post("/sell", async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // get product
    const product = await pool.query(
      "SELECT * FROM products WHERE id=$1",
      [product_id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentProduct = product.rows[0];

    if (currentProduct.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    const newQty = currentProduct.quantity - quantity;
    const totalPrice = currentProduct.price * quantity;

    // update stock
    await pool.query(
      "UPDATE products SET quantity=$1 WHERE id=$2",
      [newQty, product_id]
    );

    // record sale
    await pool.query(
      "INSERT INTO sales (product_id, quantity, total_price) VALUES ($1,$2,$3)",
      [product_id, quantity, totalPrice]
    );

    res.json({ message: "Sale successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error processing sale" });
  }
});

// GET SALES
router.get("/", async (req, res) => {
  const sales = await pool.query(`
    SELECT s.*, p.name 
    FROM sales s
    JOIN products p ON s.product_id = p.id
    ORDER BY s.created_at DESC
  `);

  res.json(sales.rows);
});

module.exports = router;