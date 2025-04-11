import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { getProductById, createProduct, updateProduct } from "@/services/productService";
import { getCategories } from "@/services/categoryService";
import { ProductFormData } from "@/types/Product";
// Importa aquí el tipo que usas para la data que espera el backend (ProductFormData)

//
// Schema de validación: se espera que los inputs de "materials" y "availableColors" sean strings
// que se transforman internamente en un array (filtrando posibles elementos vacíos).
//
const formSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  description: z
    .string()
    .min(10, { message: "La descripción debe tener al menos 10 caracteres" })
    .optional(),
  price: z.coerce.number().positive({ message: "El precio debe ser un número positivo" }),
  available: z.boolean().default(true),
  heightCm: z.coerce.number().positive({ message: "La altura debe ser un número positivo" }).optional(),
  widthCm: z.coerce.number().positive({ message: "El ancho debe ser un número positivo" }).optional(),
  depthCm: z.coerce.number().positive({ message: "La profundidad debe ser un número positivo" }).optional(),
  materials: z
    .string()
    .optional()
    .transform(val => (val ? val.split(",").map(s => s.trim()).filter(Boolean) : [])),
  availableColors: z
    .string()
    .optional()
    .transform(val => (val ? val.split(",").map(s => s.trim()).filter(Boolean) : [])),
  imageUrl: z.string().url({ message: "Debe ser una URL válida" }).optional().or(z.literal("")),
  categoryId: z.coerce.number().int().positive({ message: "Debe seleccionar una categoría" }),
});

const ProductForm = () => {
  const { id } = useParams();
  const productId = id ? parseInt(id, 10) : undefined;
  const isEditMode = !!productId;
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState([
    { id: 1, name: "Electrónicos" },
    { id: 2, name: "Ropa" },
    { id: 3, name: "Hogar" },
    { id: 4, name: "Juguetes" },
  ]);

  // Configuración del formulario. Nota: para los campos materiales y availableColors
  // se usan strings como default (input de texto) y luego Zod los transforma en arrays.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      available: true,
      heightCm: undefined,
      widthCm: undefined,
      depthCm: undefined,
      materials: "", // <-- string vacío, no un array
      availableColors: "", // <-- string vacío
      imageUrl: "",
      categoryId: 1,
    },
  });

  // Obtención de categorías desde el backend (o servicio)
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  useEffect(() => {
    if (categoriesQuery.data && Array.isArray(categoriesQuery.data)) {
      setCategories(categoriesQuery.data);
    }
  }, [categoriesQuery.data]);

  // Si estamos en modo de edición, se carga el producto
  const { data: productData, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => {
      if (!productId) return null;
      return getProductById(productId);
    },
    enabled: isEditMode,
  });

  // Cuando llegan los datos del producto, se resetea el formulario con ellos.
  // Para los campos de array se convierten a string con join(", ")
  useEffect(() => {
    if (productData) {
      form.reset({
        name: productData.name,
        description: productData.description || "",
        price: productData.price,
        available: productData.available ?? true,
        heightCm: productData.heightCm,
        widthCm: productData.widthCm,
        depthCm: productData.depthCm,
        materials: productData.materials ? productData.materials.join(", ") : "",
        availableColors: productData.availableColors ? productData.availableColors.join(", ") : "",
        imageUrl: productData.imageUrl || "",
        categoryId: productData.categoryId || 1,
      });
    }
  }, [productData, form]);

  // Mutación para crear producto
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Producto creado",
        description: "El producto ha sido creado exitosamente",
      });
      navigate("/products");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el producto",
      });
    },
  });

  // Mutación para actualizar producto (usa PATCH, que es lo que definiste en el controlador)
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) =>
      updateProduct(id, data),
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Producto actualizado",
        description: "El producto ha sido actualizado exitosamente",
      });
      navigate("/products");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al actualizar el producto",
      });
    },
  });

  // Envío del formulario.
  // La validación de Zod se encarga de transformar los campos materiales y availableColors
  // de string a array, para que se envíe la información en el formato correcto.
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (isEditMode && productId) {
      updateMutation.mutate({ id: productId, data: data as unknown as ProductFormData });
    } else {
      createMutation.mutate(data as unknown as ProductFormData);
    }
  };

  if (isEditMode && isLoading) {
    return <div className="flex justify-center p-8">Cargando información del producto...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {isEditMode ? "Editar Producto" : "Registrar Producto"}
          </h2>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese el nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describa el producto"
                        rows={4}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base"
                          {...field}
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="heightCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alto (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="widthCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ancho (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="depthCm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profundidad (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          {...field}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materiales</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Algodón, Poliéster, etc. (separados por comas)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ingrese los materiales separados por comas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableColors"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colores disponibles</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Rojo, Azul, Verde, etc. (separados por comas)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ingrese los colores separados por comas</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la Imagen (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>Ingrese una URL de imagen para el producto</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/products")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Guardando..."
                  : isEditMode
                  ? "Actualizar"
                  : "Guardar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ProductForm;
