const API_BASE = "https://ecommerce.routemisr.com/api/v1";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
    
    if (!res.ok) {
      let errorMessage = `Request failed ${res.status}`;
      let errorDetails = "";
      
      try {
        const errorData = await res.json();
        errorDetails = errorData.message || errorData.error || "";
      } catch (e) {
        const text = await res.text().catch(() => "");
        errorDetails = text;
      }
      
      if (errorDetails) {
        errorMessage += `: ${errorDetails}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return res.json();
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server');
      }
      throw error;
    }
}

export const api = {
  getProducts: (query = "") => request(`/products${query ? `?${query}` : ""}`),
  getCategories: () => request("/categories"),
  getBrands: () => request("/brands"),

  signup: (body) => request("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/signin", { method: "POST", body: JSON.stringify(body) }),
  forgotPassword: (body) => request("/auth/forgotPasswords", { method: "POST", body: JSON.stringify(body) }),
  verifyResetCode: (body) => request("/auth/verifyResetCode", { method: "POST", body: JSON.stringify(body) }),
  resetPassword: (body) => request("/auth/resetPassword", { method: "PUT", body: JSON.stringify(body) }),

  getCart: (token) => request("/cart", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
  addToCart: (productId, token) => request("/cart", { method: "POST", body: JSON.stringify({ productId }), headers: { Authorization: token ? `Bearer ${token}` : "" } }),
  removeFromCart: (productId, token) => request(`/cart/${productId}`, { method: "DELETE", headers: { Authorization: token ? `Bearer ${token}` : "" } }),

  createOrder: (body, token) => request("/orders", { method: "POST", body: JSON.stringify(body), headers: { Authorization: token ? `Bearer ${token}` : "" } }),

  getWishlist: (token) => request("/wishlist", { headers: { Authorization: token ? `Bearer ${token}` : "" } }),
  toggleWishlist: (productId, token) => request("/wishlist", { method: "POST", body: JSON.stringify({ productId }), headers: { Authorization: token ? `Bearer ${token}` : "" } }),
};



