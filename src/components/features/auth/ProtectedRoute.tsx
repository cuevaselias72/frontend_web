'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

interface Props {
  children: React.ReactNode;

  allowedRoles?: string[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: Props) {
  const router = useRouter();

  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.rol.nombre_rol)
    ) {
      router.replace('/');
    }
  }, [
    loading,
    isAuthenticated,
    user,
    router,
    allowedRoles,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  return children;
}