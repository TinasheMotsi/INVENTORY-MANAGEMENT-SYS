const pool = require("../config/db");

// 📊 GET DASHBOARD STATS
exports.getDashboard = async (req, res) => {
  try {
    // Total products
    const totalProducts = await pool.query(
      "SELECT COUNT(*) FROM products"
    );

    // Total stock
    const totalStock = await pool.query(
      "SELECT SUM(quantity) FROM products"
    );

    // Low stock (less than 5)
    const lowStock = await pool.query(
      "SELECT * FROM products WHERE quantity < 5"
    );

    res.json({
      totalProducts: totalProducts.rows[0].count,
      totalStock: totalStock.rows[0].sum || 0,
      lowStock: lowStock.rows
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
// 📈 STOCK HISTORY
exports.getStockHistory = async (req, res) => {
  try {
    const history = await pool.query(`
      SELECT sm.*, p.name 
      FROM stock_movements sm
      JOIN products p ON sm.product_id = p.id
      ORDER BY sm.created_at DESC
    `);

    res.json(history.rows);
  } catch (err) {
    console.error("HISTORY ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};