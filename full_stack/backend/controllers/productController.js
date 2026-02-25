const db = require("../db");

exports.getProducts = (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result);
  });
};

exports.getProductBySlug = (req, res) => {
  const slug = req.params.slug;

  const query = `
  SELECT * FROM products WHERE slug = ?
  `;

  db.query(query, [slug], (err, result) => {
    if (err) return res.status(500).json(err);

    res.json(result[0]);
  });
};