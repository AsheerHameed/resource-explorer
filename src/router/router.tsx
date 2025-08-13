import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import CharacterListPage from "../pages/CharacterListPage";
import CharacterDetailPage from "../pages/CharacterDetailPage";
import FavoritesPage from "../pages/FavoritesPage";

// routes for our pages/feature components
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <CharacterListPage/> },
      { path: "characters/:id", element: <CharacterDetailPage /> },
      { path: "favorites", element: <FavoritesPage /> },
    ],
  },
]);