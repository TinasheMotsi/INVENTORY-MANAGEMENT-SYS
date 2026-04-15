const pool = require("../config/db");

// ➕ CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    const { name, category, price, quantity, supplier } = req.body;

    const newProduct = await pool.query(
      "INSERT INTO products (name, category, price, quantity, supplier) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [name, category, price, quantity, supplier]
    );

    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 📋 GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    const products = await pool.query("SELECT * FROM products ORDER BY id DESC");
    res.json(products.rows);
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, supplier } = req.body;

    const updatedProduct = await pool.query(
      "UPDATE products SET name=$1, category=$2, price=$3, quantity=$4, supplier=$5 WHERE id=$6 RETURNING *",
      [name, category, price, quantity, supplier, id]
    );

    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM products WHERE id=$1", [id]);

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};