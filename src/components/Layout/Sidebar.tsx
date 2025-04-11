
import { NavLink } from "react-router-dom";
import { Home, Package, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar = () => {
  const navItems = [
    { 
      title: "Dashboard", 
      path: "/", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      title: "Productos", 
      path: "/products", 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      title: "Registrar Producto", 
      path: "/products/new", 
      icon: <PlusCircle className="h-5 w-5" /> 
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-border">
      <div className="p-4 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">Villa&Tradicion</h1>
        <p className="text-sm text-muted-foreground">Admin Panel</p>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                {item.icon}
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
