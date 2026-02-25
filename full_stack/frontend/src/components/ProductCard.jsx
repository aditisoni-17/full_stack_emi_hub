import { Link } from "react-router-dom";

function formatCurrency(amount) {
  const numericAmount = Number(amount || 0);
  return `₹${numericAmount.toLocaleString("en-IN")}`;
}

function ProductCard({ product }) {
  const targetSlug = product.slug || product.id;
  const displayPrice =
    product.starting_price || product.price || product.mrp || 0;
  const productImage = product.image_url || "/vite.svg";

  return (
    <Link to={`/products/${targetSlug}`} className="product-card" aria-label={product.name}>
      <div className="product-card__image-wrap">
        <img
          src={productImage}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
      </div>
      <div className="product-card__content">
        <h3>{product.name}</h3>
        <p>Multiple variants available</p>
        <strong>{formatCurrency(displayPrice)}</strong>
      </div>
    </Link>
  );
}

export default ProductCard;
