


import { RouterProvider, createBrowserRouter} from "react-router-dom";
import MapMarkers from "./mapmarkers";
import Home from "../pages/home/home";
import Redirect from "./redirect";

function Router() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
            errorElement: <Redirect />
        },
        {
            path: "/map/:mapid",
            element: <MapMarkers />,
            errorElement: <Redirect />
        },
        {
            path: "*",
            element: <Redirect />
        }
    ])

    return <RouterProvider router={router} />;
}

export default Router