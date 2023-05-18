import { createBrowserRouter } from "react-router-dom";

import { HomeView } from "../home-view";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeView />,
  }
]);
