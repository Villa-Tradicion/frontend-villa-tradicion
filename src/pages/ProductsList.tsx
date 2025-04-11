
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pencil, PlusCircle, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { deleteProduct, getProducts } from "@/services/productService";
import { useToast } from "@/hooks/use-toast";
import { getCategories } from "@/services/categoryService";

const ProductsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  
  // Fetch products with React Query
  const {
    data: products = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const filteredProducts = selectedCategoryId
  ? products.filter((product) => product.categoryId === selectedCategoryId)
  : products;


  // Handle product deletion
  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente",
      });
      refetch();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al eliminar el producto",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Lista de Productos</h2>
        <Button onClick={() => navigate('/products/new')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>
      <div className="flex justify-end mb-4">
        <select
          className="border border-gray-300 rounded px-3 py-2 text-sm"
          value={selectedCategoryId ?? ""}
          onChange={(e) =>
            setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Todas las categorías</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <p>Cargando productos...</p>
            </div>
          ) : isError ? (
            <div className="flex justify-center p-4 text-red-500">
              <p>Error al cargar los productos. Intente nuevamente.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="mb-4 text-muted-foreground">No hay productos registrados</p>
              <Button onClick={() => navigate('/products/new')}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Registrar Producto
              </Button>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {/* <TableHead>ID</TableHead> */}
                    <TableHead>Nombre</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      {/* <TableCell>{product.id}</TableCell> */}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={product.available ? "default" : "secondary"}>
                          {product.available ? "Disponible" : "No disponible"}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => navigate(`/products/edit/${product.id}`)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsList;
