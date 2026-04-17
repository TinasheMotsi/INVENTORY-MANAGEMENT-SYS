const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.post("/", productController.createProduct);
router.get("/", productController.getProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.get("/stats", async (req, res) => {
  const totalProducts = await pool.query("SELECT COUNT(*) FROM products");
  const totalStock = await pool.query("SELECT SUM(quantity) FROM products");

  res.json({
    totalProducts: totalProducts.rows[0].count,
    totalStock: totalStock.rows[0].sum,
  });
});

module.exports = router;