'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const router = useRouter();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (
      user?.rol.nombre_rol === 'Admin' ||
      user?.rol.nombre_rol === 'Maestro'
    ) {
      router.replace('/dashboard');
      return;
    }

    if (user?.rol.nombre_rol === 'Alumno') {
      router.replace('/mis_calificaciones');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-500">
        Redirigiendo...
      </p>
    </div>
  );
}