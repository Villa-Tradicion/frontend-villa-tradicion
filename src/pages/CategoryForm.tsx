import { useState } from 'react';
import { createCategory } from '@/services/categoryService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; // 👈 Importa el toast

export default function CategoryForm() {
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name.trim()) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
  
    try {
      const newCategory = await createCategory({ name });
  
      toast.success(`Categoría "${newCategory.name}" registrada correctamente`);
      setName('');
    } catch (error: any) {
      console.error('Error al crear la categoría:', error);
  
      // Axios o fetch personalizado lanza error.message y error.status
      if (error.status === 409) {
        toast.error(error.message); // Mostrar el mensaje personalizado del backend
      } else {
        toast.error("Hubo un error al registrar la categoría.");
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <Label htmlFor="name">Nombre de la categoría</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Registrar categoría</Button>
    </form>
  );
}
