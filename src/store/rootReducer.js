import { combineReducers } from "redux";
import loginReducer from "../store/slice/login";
import parentCategoryReducer from "./slice/parentCategorySlice";
import subCategoryReducer from "./slice/subCategorySlice";
import bannerReducer from "./slice/bannerSlice";
import adBannerReducer from "./slice/adBannerSlice";
import brandsReducer from "./slice/brandsSlice";
import offerReducer from "./slice/offersSlice";
import authmeReducer from "./slice/authme";
import productReducer from "./slice/productSlice";
import dealsReducer from "./slice/dealsSlice";
import typeReducer from "./slice/typeSlice";
import orderReducer from "./slice/OrderSlice";
import usersReducer from "./slice/usersSlice";
import dashboardReducer from "./slice/dashboardSlice";
const reducer = combineReducers({
  login: loginReducer,
  parentCategory: parentCategoryReducer,
  subcategory: subCategoryReducer,
  banner: bannerReducer,
  adBanner: adBannerReducer,
  brands: brandsReducer,
  offers: offerReducer,
  authme: authmeReducer,
  product: productReducer,
  deals: dealsReducer,
  type: typeReducer,
  order: orderReducer,
  users: usersReducer,
  adminDashboard: dashboardReducer,
});
export default reducer;
