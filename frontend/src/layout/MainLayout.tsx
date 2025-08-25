import { NavbarDemo } from "../layout/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <NavbarDemo />
      <Outlet />
    </>
  );
};

export default MainLayout;
