function VariantSelector({
  colors,
  storages,
  selectedColor,
  selectedStorage,
  onColorChange,
  onStorageChange,
}) {
  return (
    <section className="variant-selector">
      <div className="variant-field">
        <label htmlFor="color-select">Color</label>
        <select
          id="color-select"
          value={selectedColor}
          onChange={(event) => onColorChange(event.target.value)}
        >
          {!colors.length ? <option value="">No colors</option> : null}
          {colors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      <div className="variant-field">
        <label htmlFor="storage-select">Variant</label>
        <select
          id="storage-select"
          value={selectedStorage}
          onChange={(event) => onStorageChange(event.target.value)}
        >
          {!storages.length ? <option value="">No variants</option> : null}
          {storages.map((storage) => (
            <option key={storage} value={storage}>
              {storage}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default VariantSelector;
