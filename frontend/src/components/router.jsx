


import { RouterProvider, createBrowserRouter, Redirect } from "react-router-dom";
import MapMarkers from "./mapmarkers";
import Home from "../pages/home/home";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/map/:mapid",
            element: <MapMarkers />
        },
        {
            path: "*",
            element: <Redirect to="/" />
        }
    ])

    return <RouterProvider router={router} />;
}

export default Router