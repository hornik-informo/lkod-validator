import { createBrowserRouter } from "react-router-dom";

import { HomeView } from "../home-view";
import { AboutView } from "../about-view";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  },
  {
    path: "about",
    element: <AboutView />,
  },
]);
