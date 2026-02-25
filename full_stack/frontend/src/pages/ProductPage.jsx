import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EMIPlanList from "../components/EMIPlanList";
import ProceedButton from "../components/ProceedButton";
import ProductDetails from "../components/ProductDetails";
import { getProductBySlug } from "../services/productService";

function formatCurrency(amount) {
  const numericAmount = Number(amount || 0);
  return `₹${numericAmount.toLocaleString("en-IN")}`;
}

function getEmiStartLabel(plan) {
  const rawStartDate = plan?.emi_start_date || plan?.start_date;

  if (!rawStartDate) {
    return "EMI starts from next billing cycle";
  }

  const parsed = new Date(rawStartDate);
  if (Number.isNaN(parsed.getTime())) {
    return "EMI starts from next billing cycle";
  }

  return `EMIs start on ${parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}

function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError("");
      setSelectedPlan(null);

      try {
        const data = await getProductBySlug(slug);
        setProduct(data);

        const firstVariant = data?.variants?.[0];
        setSelectedColor(firstVariant?.color || "");
        setSelectedStorage(firstVariant?.storage || "");
        setMainImage(firstVariant?.image_url || data?.image_url || "");
      } catch {
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  const variants = useMemo(() => product?.variants || [], [product]);

  const colors = useMemo(
    () => [...new Set(variants.map((variant) => variant.color).filter(Boolean))],
    [variants]
  );

  const storages = useMemo(
    () => [...new Set(variants.map((variant) => variant.storage).filter(Boolean))],
    [variants]
  );

  const validStorages = useMemo(() => {
    if (!selectedColor) return storages;
    return [
      ...new Set(
        variants
          .filter((variant) => variant.color === selectedColor)
          .map((variant) => variant.storage)
          .filter(Boolean)
      ),
    ];
  }, [selectedColor, storages, variants]);

  const validColors = useMemo(() => {
    if (!selectedStorage) return colors;
    return [
      ...new Set(
        variants
          .filter((variant) => variant.storage === selectedStorage)
          .map((variant) => variant.color)
          .filter(Boolean)
      ),
    ];
  }, [selectedStorage, colors, variants]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) {
      return null;
    }

    const exactMatch = variants.find(
      (variant) =>
        variant.color === selectedColor && variant.storage === selectedStorage
    );

    if (exactMatch) {
      return exactMatch;
    }

    const colorMatch = variants.find((variant) => variant.color === selectedColor);

    return colorMatch || variants[0];
  }, [variants, selectedColor, selectedStorage]);

  const emiPlans = useMemo(() => {
    const plans = selectedVariant?.emi_plans || [];
    return [...plans].sort((a, b) => Number(a.tenure) - Number(b.tenure));
  }, [selectedVariant]);

  const currentPrice = Number(selectedVariant?.price || 0);
  const currentMrp = Number(selectedVariant?.mrp || currentPrice);
  const discountPct = currentMrp > 0
    ? Math.max(0, Math.round(((currentMrp - currentPrice) / currentMrp) * 100))
    : 0;
  const downpayment = Number(
    selectedPlan?.downpayment || Math.round(currentPrice * 0.15)
  );

  useEffect(() => {
    if (!emiPlans.length) {
      setSelectedPlan(null);
      return;
    }

    setSelectedPlan((currentPlan) => {
      if (!currentPlan) {
        return emiPlans[0] || null;
      }

      const matchingPlan = emiPlans.find((plan) => plan.id === currentPlan.id);
      return matchingPlan || emiPlans[0] || null;
    });
  }, [emiPlans]);

  useEffect(() => {
    if (selectedStorage && !validStorages.includes(selectedStorage)) {
      setSelectedStorage(validStorages[0] || "");
    }
  }, [selectedStorage, validStorages]);

  useEffect(() => {
    if (selectedColor && !validColors.includes(selectedColor)) {
      setSelectedColor(validColors[0] || "");
    }
  }, [selectedColor, validColors]);

  useEffect(() => {
    if (!selectedVariant) {
      return;
    }

    setSelectedColor(selectedVariant.color || "");
    setSelectedStorage(selectedVariant.storage || "");
    setMainImage(selectedVariant.image_url || product?.image_url || "");
  }, [selectedVariant, product?.image_url]);

  const handleProceed = () => {
    if (!selectedPlan || !selectedVariant) {
      return;
    }

    const query = new URLSearchParams({
      variantId: String(selectedVariant.id),
      planId: String(selectedPlan.id),
    });

    navigate(`/products/${slug}?${query.toString()}`);
  };

  if (loading) {
    return <main className="app-container status-text">Loading product...</main>;
  }

  if (error || !product) {
    return (
      <main className="app-container status-text error">
        {error || "Product not found."}
      </main>
    );
  }

  return (
    <main className="app-container product-page-wrap">
      <p className="breadcrumb">
        Shop on EMI &gt; Smart Phones &gt; {product.name}
      </p>

      <section className="product-page">
        <ProductDetails
          product={product}
          variant={selectedVariant}
          mainImage={mainImage}
          onImageSelect={setMainImage}
          colors={validColors}
          storages={validStorages}
          selectedColor={selectedColor}
          selectedStorage={selectedStorage}
          onColorChange={setSelectedColor}
          onStorageChange={setSelectedStorage}
        />

        <aside className="purchase-panel">
          <h1 className="purchase-title">{product.name}</h1>
          <p className="purchase-subtitle">
            (Storage: {selectedVariant?.storage || "N/A"}, Color: {selectedVariant?.color || "N/A"})
          </p>

          <div className="price-row">
            <h2 className="purchase-price">{formatCurrency(currentPrice)}</h2>
            <span className="mrp-price">{formatCurrency(currentMrp)}</span>
            <span className="off-pill">{discountPct}% OFF</span>
          </div>

          <div className="emi-box">
            <p className="pay-now">
              Pay Now : {formatCurrency(downpayment)} Downpayment
            </p>
            <EMIPlanList
              plans={emiPlans}
              selectedPlanId={selectedPlan?.id}
              onSelect={setSelectedPlan}
              emiStartLabel={getEmiStartLabel(selectedPlan)}
            />

            <ProceedButton selectedPlan={selectedPlan} onProceed={handleProceed} />
          </div>

          <div className="trust-details" />
        </aside>
      </section>
    </main>
  );
}

export default ProductPage;
