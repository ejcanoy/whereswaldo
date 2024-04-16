


import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MapMarkers from "./mapmarkers";
import Home from "../pages/home/home";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />
        },
        {
            path: "/map:mapid",
            element: <MapMarkers />
        }
    ])

    return <RouterProvider router={router} />;
}

export default Router