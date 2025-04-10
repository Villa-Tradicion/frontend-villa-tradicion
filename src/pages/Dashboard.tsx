
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProducts } from "@/services/productService";
import { Product } from "@/types/Product";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [totalProductos, setTotalProductos] = useState<number>(0);
  const [porcentajeCambio, setPorcentajeCambio] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productos = await getProducts();

        const now = new Date();
        const veinteMin = 20 * 60 * 1000; // 20 minutos en ms

        const hace20Min = new Date(now.getTime() - veinteMin);
        const hace40Min = new Date(now.getTime() - 2 * veinteMin);

        let productosRecientes = 0;
        let productosAnteriores = 0;

        productos.forEach((producto: Product) => {
          const fecha = new Date(producto.createdAt);

          if (fecha > hace20Min && fecha <= now) {
            productosRecientes++;
          } else if (fecha > hace40Min && fecha <= hace20Min) {
            productosAnteriores++;
          }
        });

        setTotalProductos(productosRecientes);

        if (productosAnteriores > 0) {
          const porcentaje = ((productosRecientes - productosAnteriores) / productosAnteriores) * 100;
          setPorcentajeCambio(Math.round(porcentaje));
        } else {
          setPorcentajeCambio(null);
        }

      } catch (error) {
        console.error("Error cargando productos:", error);
      }
    };

    fetchData();

    // Opcional: refrescar cada 20 minutos automáticamente
    const interval = setInterval(fetchData, 20 * 60 * 1000); // cada 20 min

    return () => clearInterval(interval);
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
              {porcentajeCambio !== null
                ? `${porcentajeCambio > 0 ? "+" : ""}${porcentajeCambio}% en comparación con los 20min anteriores`
                : "Sin datos anteriores para comparar"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
