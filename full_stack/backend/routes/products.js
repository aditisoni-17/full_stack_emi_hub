const express = require("express");
const router = express.Router();

const db = require("../db");



router.get("/", (req, res) => {

  const query = "SELECT * FROM products";

  db.query(query, (err, result) => {

    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    res.json(result);

  });

});


router.get("/:slug", (req, res) => {

  const { slug } = req.params;

    // products
  const productQuery = `
    SELECT * FROM products
    WHERE slug = ? OR id = ?
    LIMIT 1
  `;

  db.query(productQuery, [slug, Number(slug) || 0], (err, productResult) => {

    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    if (productResult.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = productResult[0];

    // variants
    const variantQuery = "SELECT * FROM variants WHERE product_id = ?";

    db.query(variantQuery, [product.id], (err, variants) => {

      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }

      if (variants.length === 0) {
        product.variants = [];
        return res.json(product);
      }

      const variantIds = variants.map(v => v.id);

    //  emi plans
      const emiQuery = `
        SELECT * FROM emi_plans
        WHERE variant_id IN (?)
      `;

      db.query(emiQuery, [variantIds], (err, emiPlans) => {

        if (err) {
          console.error(err);
          return res.status(500).json(err);
        }

        
        variants.forEach(variant => {

          variant.emi_plans = emiPlans.filter(
            plan => plan.variant_id === variant.id
          );

        });

        
        product.variants = variants;

        res.json(product);

      });

    });

  });

});


module.exports = router;
