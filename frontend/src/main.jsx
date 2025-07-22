import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import TransactionHistory from "./components/Transaction/TransactionHistory.jsx";
import { BankingContextProvider } from "./context/BankingContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:"/transaction-history",
    element:<TransactionHistory/>
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BankingContextProvider> {/* 👈 Wrap all routes here */}
      <RouterProvider router={router} />
    </BankingContextProvider>
  </StrictMode>
);
