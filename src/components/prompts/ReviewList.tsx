'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Review } from '@/types';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, {
    message: 'El comentario debe tener al menos 10 caracteres.',
  }),
});

type ReviewListProps = {
  promptId: string;
  reviews: Review[];
  userHasPurchased?: boolean;
  userHasReviewed?: boolean;
};

export default function ReviewList({
  promptId,
  reviews,
  userHasPurchased = false,
  userHasReviewed = false,
}: ReviewListProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (values.rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setIsSubmitting(true);

    try {
      // En un entorno real, aquí enviaríamos los datos a la API
      // Simulamos un retraso para mostrar el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Reseña enviada correctamente');
      form.reset();
      setCurrentRating(0);
    } catch (error) {
      toast.error('Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reseñas</h2>

      {userHasPurchased && !userHasReviewed && (
        <Card className="p-4">
          <h3 className="mb-4 font-medium">Deja tu reseña</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calificación</FormLabel>
                    <FormControl>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            className="p-1"
                            onClick={() => {
                              setCurrentRating(rating);
                              field.onChange(rating);
                            }}
                            onMouseEnter={() => setHoverRating(rating)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <Star
                              className={`h-6 w-6 ${rating <= (hoverRating || currentRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentario</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Comparte tu experiencia con este prompt"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
              </Button>
            </form>
          </Form>
        </Card>
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.user.avatar_url} alt={review.user.name} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{review.user.name}</span>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">No hay reseñas todavía.</p>
        </Card>
      )}
    </div>
  );
}