import VariantSelector from "./VariantSelector";

function toImageArray(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);

  if (typeof raw === "string") {
    const trimmed = raw.trim();

    if (!trimmed) return [];

    if (trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
      } catch {
        return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
      }
    }

    return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function ProductDetails({
  product,
  variant,
  mainImage,
  onImageSelect,
  colors,
  storages,
  selectedColor,
  selectedStorage,
  onColorChange,
  onStorageChange,
}) {
  const gallery = [
    ...toImageArray(variant?.image_urls),
    ...toImageArray(product?.image_urls),
    variant?.image_url,
    product?.image_url,
  ].filter(Boolean);
  const thumbnails = gallery.length > 0 ? gallery : [];

  return (
    <section className="product-details-layout">
      <div className="gallery-panel">
        <div className="gallery-thumbs">
          {thumbnails.map((image, idx) => (
            <button
              key={`${image}-${idx}`}
              type="button"
              className={`gallery-thumb ${mainImage === image ? "active" : ""}`}
              onClick={() => onImageSelect(image)}
            >
              <img src={image} alt={`${product.name} ${idx + 1}`} />
            </button>
          ))}
        </div>

        <div className="gallery-main">
          <img src={mainImage || product.image_url} alt={product.name} />
        </div>
      </div>

      <VariantSelector
        colors={colors}
        storages={storages}
        selectedColor={selectedColor}
        selectedStorage={selectedStorage}
        onColorChange={onColorChange}
        onStorageChange={onStorageChange}
      />
    </section>
  );
}

export default ProductDetails;
