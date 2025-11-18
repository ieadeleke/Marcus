import { useRoutes } from "react-router-dom"
import Dashboard from "../pages/dashboard/Index";
import Home from "../pages/home/Index";
import Components from "../components/Index";
import Privacy from "../pages/home/Privacy";
import Terms from "../pages/home/Terms";

export const HomeRoutes = () =>{
    return[
      { path: "/", element: <Home /> },
      { path: "/components", element: <Components /> },
      { path: "/privacy", element: <Privacy /> },
      { path: "/terms", element: <Terms /> },
    ];
}
