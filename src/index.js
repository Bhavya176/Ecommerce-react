import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";

import GoogleAnalytics from "./pages/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

// Loaders and error boundary
import Loader from "./components/Loader";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Product"));
const Products = lazy(() => import("./pages/Products"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Checkout = lazy(() => import("./pages/Checkout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const AddProductPage = lazy(() => import("./pages/AddProduct"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Profile = lazy(() => import("./pages/Profile"));
const TicToeGame = lazy(() => import("./pages/TicToeGame"));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <GoogleAnalytics />
    <Analytics />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Products />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/addProduct" element={<AddProductPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/TicToeGame" element={<TicToeGame />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);

serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log("New content is available; please refresh.", registration);
  },
  onSuccess: (registration) => {
    console.log("App is cached for offline use.", registration);
  },
});

reportWebVitals();
