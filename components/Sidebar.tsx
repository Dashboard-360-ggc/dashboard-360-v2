// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Lista de enlaces del menú
const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Ventas', href: '/ventas' },
  { name: 'Análisis de Ventas', href: '/analisis-ventas' },
  { name: 'Inventario', href: '/inventario' },
  { name: 'Mermas', href: '/mermas' },
  { name: 'Análisis de Mermas', href: '/analisis-mermas' },
  { name: 'Colaboradores', href: '/colaboradores' },
  { name: 'Asistencia', href: '/asistencia' },
  { name: 'Desempeño', href: '/desempeno' },
  { name: 'Gestionar Tareas', href: '/gestion-tareas' },
  { name: 'Mis Tareas', href: '/mis-tareas' },
  { name: 'Clima Laboral', href: '/clima-laboral' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">El Carbonazo</h2>
      <nav>
        <ul>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.name} className="mb-2">
                <Link href={link.href}
                   className={`block p-3 rounded-lg hover:bg-gray-700 ${isActive ? 'bg-blue-600' : ''}`}>
                    {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}