
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/Product";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [totalProductos, setTotalProductos] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productos = await getProducts();
        setTotalProductos(productos.length); // 👈 obtenemos el total real
      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Bienvenido al Panel de Administración</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductos}</div>
            <p className="text-xs text-muted-foreground">
              
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
