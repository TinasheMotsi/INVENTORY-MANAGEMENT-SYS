const pool = require("../config/db");

// 📥 STOCK IN
exports.stockIn = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Update product quantity
    await pool.query(
      "UPDATE products SET quantity = quantity + $1 WHERE id = $2",
      [quantity, product_id]
    );

    // Record movement
    await pool.query(
      "INSERT INTO stock_movements (product_id, type, quantity) VALUES ($1,$2,$3)",
      [product_id, "IN", quantity]
    );

    res.json({ message: "Stock added successfully" });
  } catch (err) {
    console.error("STOCK IN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📤 STOCK OUT
exports.stockOut = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Check current stock
    const product = await pool.query(
      "SELECT quantity FROM products WHERE id = $1",
      [product_id]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentStock = product.rows[0].quantity;

    // Prevent negative stock ❗
    if (currentStock < quantity) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    // Update quantity
    await pool.query(
      "UPDATE products SET quantity = quantity - $1 WHERE id = $2",
      [quantity, product_id]
    );

    // Record movement
    await pool.query(
      "INSERT INTO stock_movements (product_id, type, quantity) VALUES ($1,$2,$3)",
      [product_id, "OUT", quantity]
    );

    res.json({ message: "Stock removed successfully" });
  } catch (err) {
    console.error("STOCK OUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};