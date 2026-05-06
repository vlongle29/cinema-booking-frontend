import { Outlet } from "react-router-dom";
import Header from "./Header";

const LayoutDashboard = () => {
   return (
      <div className="app-layout">
         <Header />
         <main className="main-content">
            <Outlet />
         </main>
      </div>
   );
};

export default LayoutDashboard;
