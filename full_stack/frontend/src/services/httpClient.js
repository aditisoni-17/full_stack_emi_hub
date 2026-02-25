async function request(path, options = {}) {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.DEV ? "http://localhost:5002/api" : "/api");
  const response = await fetch(`${baseURL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  const data = await response.json();
  return { data };
}

const httpClient = {
  get(path) {
    return request(path, { method: "GET" });
  },
};

export default httpClient;
