"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const MENU_LINKS = {
  Admin: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Materias", href: "/materias" },
    { label: "Alumnos", href: "/alumnos" },
    { label: "Grupos", href: "/grupos" },
    { label: "Profesores", href: "/profesores" },
  ],
  Maestro: [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Materias', href: '/mis_materias' },
    { label: 'Rúbricas', href: '/rubricas' },
  ],
  Alumno: [
    { label: "Mis Calificaciones", href: "/mis_calificaciones" },
    { label: "Evaluaciones", href: "/evaluaciones" },
  ],
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useAuth();
  const userRole = (user?.rol.nombre_rol as keyof typeof MENU_LINKS) || "Alumno";

  const links = MENU_LINKS[userRole] || [];
  const currentTitle =
    links.find((link) => pathname.includes(link.href))?.label || "Dashboard";

  async function confirmLogout() {
    setIsLoggingOut(true); 
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
      setIsLoggingOut(false); 
    }
  }

  return (
    <>
      <header className="flex items-center h-16 px-4 bg-[#b8b6b6] border-b border-neutral-200 sticky top-0 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 mr-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-xl transition-all"
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-xl font-medium text-neutral-800 tracking-tight">
          {currentTitle}
        </h1>
      </header>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 w-72 h-full bg-[#B3B3B3] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-700 hover:text-black hover:bg-black/10 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 pt-2 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 text-lg rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-neutral-400 text-neutral-900 font-semibold shadow-sm"
                    : "text-neutral-700 hover:bg-black/5 hover:text-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <button
            onClick={() => {
              setIsOpen(false); 
              setIsLogoutModalOpen(true); 
            }}
            className="w-full flex justify-center items-center gap-2 px-4 py-3.5 bg-neutral-800 hover:bg-black text-white rounded-xl text-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            <span>Cerrar sesión</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </aside>

      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                ¿Cerrar sesión?
              </h3>
              <p className="text-neutral-600 text-sm">
                ¿Estás seguro de que deseas salir de tu cuenta? Tendrás que volver a iniciar sesión para acceder.
              </p>
            </div>
            
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-end gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={isLoggingOut}
                className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              
              <button
                onClick={confirmLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Cerrando...</span>
                  </>
                ) : (
                  <span>Sí, salir</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}