import client from "./httpClient";

export async function getProducts() {
  const { data } = await client.get("/products");
  return data;
}

export async function getProductBySlug(slug) {
  const { data } = await client.get(`/products/${slug}`);
  return data;
}
