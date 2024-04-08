import React from "react";
import ReactDOM from "react-dom/client";
import Background from "./Components/AuroraBackground/Background";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import Admin from "./Components/Admin/Admin";
import Manager from "./Components/Manager/Manager";
import { Auth } from "./Components/Auth/Auth"; // Ensure this is a component for rendering
import RequireAuth from "./Components/Auth/RequireAuth"; // Import the RequireAuth component

const router = createBrowserRouter([
  {
    path: "/",
    element: <Background />,
  },
  {
    path: "/Admin",
    element: <Admin />,
    // Ensure you have valid children or remove the empty object
  },
  {
    path: "/Manager",
    element: (
      <RequireAuth>
        <Manager />
      </RequireAuth>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
