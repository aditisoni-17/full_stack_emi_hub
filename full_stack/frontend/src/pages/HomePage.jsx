import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setError("Unable to load products right now.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return (
    <main className="app-container home-page">
      <section className="home-header">
        <p>Browse Devices</p>
        <h1>Choose your smartphone and pay on easy EMI</h1>
      </section>

      {loading ? <p className="status-text">Loading products...</p> : null}
      {error ? <p className="status-text error">{error}</p> : null}

      {!loading && !error ? (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 ? (
            <p className="status-text">No products available right now.</p>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}

export default HomePage;
