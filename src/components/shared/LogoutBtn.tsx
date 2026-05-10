'use client';

import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';

export default function LogoutBtn() {
  const router = useRouter();

  const { logout } = useAuth();

  async function handleLogout() {
    await logout();

    router.push('/login');
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}