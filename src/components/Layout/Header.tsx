
import { useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  
  // Determine the page title based on the current route
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === "/") return "Dashboard";
    if (path === "/products") return "Productos";
    if (path === "/products/new") return "Registrar Producto";
    if (path.startsWith("/products/edit/")) return "Editar Producto";

    if (path === "/register-category") return "Registrar Categoria";
    return "Admin Panel";
  };

  return (
    <header className="border-b border-border bg-white p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
      </div>
    </header>
  );
};
