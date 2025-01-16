import logo from "./logo.svg";
import "./App.css";
import Header from "./shared/components/header";
import "./scss/main.scss";
import Invoice from "./routs/invoice";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Components from "./shared/components";
import Edit from "./routs/edit";
import { ToastContainer } from "react-toastify";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Components />,
      children: [
        {
          index: true,
          element: <Invoice />,
        },
        {
          path: "/edit",
          element: <Edit />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;
