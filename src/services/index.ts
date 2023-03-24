import axios, { AxiosRequestHeaders } from "axios";

const checkoutBaseUrl = "http://localhost:3000/";

var headers: AxiosRequestHeaders = {
  "access-control-allow-origin": "*",
  "content-type": "application/json;charset=utf-8",
  "strict-origin-when-cross-origin": true,
  "cache-control": "no-cache",
  crossDomain: "true",
};

const api = axios.create({
  baseURL: `${checkoutBaseUrl}`,
  headers,
});

export const apis = {
  getProducts: async () => await api.get("/products"),
  updateProducts: async (body) => await api.put("/product", body),
  getOrders: async () => await api.get("/orders"),
  createProduct: async (body) => await api.post("/product", body),
  createOrder: async (body) => await api.post("/order", body),
  deleteProduct: async (body) => await api.delete("/product", { data: body }),
  getOneProduct: async (body) => await api.post("product/search", body),
  deleteOrder: async (body) => await api.delete("/order", { data: body }),
};
