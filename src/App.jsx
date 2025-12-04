import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedLayout from './protectedRoute/ProtectedRoute';
import ParentCategories from './pages/ParentCategories/ParentCategories';
import Subcategories from './pages/SubCategories/Subcategories';
import Products from './pages/Products/Products';
import AdBanner from './pages/AdBanner/AdBanner';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Banner from './pages/Banner/Banner';
import Brands from './pages/Brands/Brands';
import Offer from './pages/Offer/Offer';
import Profile from './pages/Profile/Profile';
import Deals from './pages/Deals/Deals';
import Type from './pages/Type/Type';
import TypeName from './pages/TypeName/TypeName';
import Order from './pages/Order/Order';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parent-categories" element={<ParentCategories />} />
          <Route path="/subcategories" element={<Subcategories />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/ad-banner" element={<AdBanner />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/products" element={<Products />} />
          <Route path="/type" element={<Type />} />
          <Route path="/typename" element={<TypeName />} />
          <Route path="/order" element={<Order />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
