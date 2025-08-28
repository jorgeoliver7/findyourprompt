'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAIModels } from '@/hooks/useAIModels';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(5, {
    message: 'El título debe tener al menos 5 caracteres.',
  }),
  description: z.string().min(20, {
    message: 'La descripción debe tener al menos 20 caracteres.',
  }),
  content: z.string().min(10, {
    message: 'El contenido del prompt debe tener al menos 10 caracteres.',
  }),
  price: z.coerce.number().min(0, {
    message: 'El precio debe ser un número positivo.',
  }),
  model: z.string({
    required_error: 'Por favor selecciona un modelo de IA.',
  }),
  tags: z.string().transform((val) => val.split(',').map((tag) => tag.trim())),
});

export default function NewPromptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { models, loading: modelsLoading } = useAIModels();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      price: 0,
      model: '',
      tags: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // En un entorno real, aquí enviaríamos los datos a la API
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Prompt creado correctamente');
      router.push('/dashboard/prompts');
    } catch (error) {
      toast.error('Error al crear el prompt');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-3xl font-bold">Crear Nuevo Prompt</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Un título descriptivo para tu prompt" {...field} />
                  </FormControl>
                  <FormDescription>
                    Elige un título claro que describa lo que hace tu prompt.
                  </FormDescription>
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
                      placeholder="Describe detalladamente lo que hace tu prompt y cómo puede ayudar a otros usuarios"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Una buena descripción ayuda a los usuarios a entender el valor de tu prompt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido del Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="El texto completo de tu prompt"
                      className="min-h-[200px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este es el prompt completo que los usuarios recibirán al comprar.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Establece 0 para prompts gratuitos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo de IA</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                        disabled={modelsLoading}
                      >
                        <option value="" disabled>
                          {modelsLoading ? 'Cargando modelos...' : 'Selecciona un modelo'}
                        </option>
                        {models.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Selecciona el modelo para el que está optimizado tu prompt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Etiquetas</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="productividad, escritura, negocios"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separa las etiquetas con comas. Ayudan a categorizar y encontrar tu prompt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creando...' : 'Crear Prompt'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}