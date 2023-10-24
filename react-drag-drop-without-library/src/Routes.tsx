import { Routes, Route } from "react-router-dom";
import ListSort from "./pages/ListSort";
import Skills from "./pages/Skills";


const MainRoutes = () => (
  <Routes>
    {/* <Route path="/" element={<ListSort />} /> */}
    <Route path="/" element={<Skills />} />
  </Routes>
);

export default MainRoutes;
