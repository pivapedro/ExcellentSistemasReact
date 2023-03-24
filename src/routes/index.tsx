import React from "react";
import { createBrowserRouter } from "react-router-dom";
import ProductPage from "../pages/home";
import OrderPage from "../pages/order";
import ProductForm from "../pages/product";
import OrderForm from "../pages/order/new";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProductPage />,
  },
  {
    path: "/product/new",
    element: <ProductForm />,
  },
  {
    path: "/orders",
    element: <OrderPage />,
  },
  {
    path: "/orders/new",
    element: <OrderForm />,
  },
]);
