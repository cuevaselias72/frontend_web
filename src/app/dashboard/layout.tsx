import Navbar from '@/components/shared/Navbar';
import ProtectedRoute from '@/components/features/auth/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={['Admin', 'Maestro']}
    >
      <div className="min-h-screen bg-neutral-100 flex flex-col">
        <Navbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}