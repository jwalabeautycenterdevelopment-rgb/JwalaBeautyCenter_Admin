import { Outlet, Navigate } from "react-router-dom";
import Header from "../component/Common/Header/Header";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../component/Common/Sidebar/SideBar";
import { useEffect, useRef } from "react";
import { fetchMe } from "../store/slice/authme";

const ProtectedLayout = () => {
  const dispatch = useDispatch();
  const { accessToken,  } = useSelector((state) => state.login);

  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (accessToken && !fetchedOnce.current) {
      fetchedOnce.current = true;   
      dispatch(fetchMe());
    }
  }, [accessToken, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <aside className="w-16 md:w-64 h-screen sticky top-0 overflow-y-auto">
          <Sidebar />
        </aside>
        <div className="flex-1 overflow-auto">
          <Header />
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
