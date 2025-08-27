'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createSupabaseBrowserClient } from '@/lib/supabase';
import { User } from '@/types';

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Por favor ingresa un correo electrónico válido.',
  }).optional(),
  avatar_url: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: 'Por favor ingresa tu contraseña actual.',
  }),
  newPassword: z.string().min(6, {
    message: 'La nueva contraseña debe tener al menos 6 caracteres.',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const supabase = createSupabaseBrowserClient();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
      avatar_url: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        
        // Obtener el usuario actual
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Obtener el perfil del usuario desde la tabla users
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (profile) {
            setUser(profile);
            profileForm.reset({
              name: profile.name || '',
              email: profile.email || '',
              avatar_url: profile.avatar_url || '',
            });
          }
        }
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
        toast.error('Error al cargar el perfil');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const onSubmitProfile = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsSubmittingProfile(true);
      
      if (!user) return;

      // Actualizar el perfil en la tabla users
      const { error: profileError } = await supabase
        .from('users')
        .update({
          name: values.name,
          avatar_url: values.avatar_url,
        })
        .eq('id', user.id);

      if (profileError) {
        throw profileError;
      }

      // Actualizar los metadatos del usuario en Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: values.name },
      });

      if (authError) {
        throw authError;
      }

      toast.success('Perfil actualizado exitosamente');
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar el perfil');
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  const onSubmitPassword = async (values: z.infer<typeof passwordFormSchema>) => {
    try {
      setIsSubmittingPassword(true);
      
      // Actualizar la contraseña
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword,
      });

      if (error) {
        throw error;
      }

      toast.success('Contraseña actualizada exitosamente');
      passwordForm.reset();
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la contraseña');
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Configuración de Cuenta</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <CardDescription>
              Actualiza la información de tu perfil
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="flex justify-center py-4">
                <p className="text-muted-foreground">Cargando perfil...</p>
              </div>
            ) : (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user?.avatar_url || ''} alt={user?.name || ''} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Foto de Perfil</p>
                      <p className="text-xs text-muted-foreground">
                        Próximamente: Funcionalidad para subir imágenes
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="tu@email.com" 
                            type="email" 
                            disabled 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          El correo electrónico no se puede cambiar
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={isSubmittingProfile}>
                    {isSubmittingProfile ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cambiar Contraseña</CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña Actual</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmittingPassword}>
                  {isSubmittingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}