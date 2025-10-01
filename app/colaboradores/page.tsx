'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface Colaborador {
  id: string;
  nombre: string;
  puesto: string;
  local: string;
}

export default function ColaboradoresPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [nuevoColaborador, setNuevoColaborador] = useState({
    nombre: '',
    puesto: '',
    local: 'Principal',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchColaboradores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "colaboradores"));
      const colaboradoresList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Colaborador[];
      setColaboradores(colaboradoresList);
    } catch (error) {
      console.error("Error al cargar colaboradores: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const handleAddColaborador = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (nuevoColaborador.nombre && nuevoColaborador.puesto && nuevoColaborador.local) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, "colaboradores"), nuevoColaborador);
        setNuevoColaborador({ nombre: '', puesto: '', local: 'Principal' });
        fetchColaboradores();
      } catch (error) {
        console.error("Error al agregar colaborador: ", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteColaborador = async (id: string) => {
    const confirmation = confirm("¿Estás seguro de que quieres eliminar a este colaborador?");
    if (confirmation) {
      try {
        await deleteDoc(doc(db, "colaboradores", id));
        setColaboradores(colaboradores.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error al eliminar colaborador: ", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Colaboradores</h1>
      
      <form onSubmit={handleAddColaborador} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl mb-3 font-semibold">Agregar Nuevo Colaborador</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Nombre completo"
            value={nuevoColaborador.nombre}
            onChange={(e) => setNuevoColaborador({ ...nuevoColaborador, nombre: e.target.value })}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Puesto (Mesero, Cocina, etc.)"
            value={nuevoColaborador.puesto}
            onChange={(e) => setNuevoColaborador({ ...nuevoColaborador, puesto: e.target.value })}
            className="border p-2 rounded-md"
            required
          />
           <input
            type="text"
            placeholder="Local o Sucursal"
            value={nuevoColaborador.local}
            onChange={(e) => setNuevoColaborador({ ...nuevoColaborador, local: e.target.value })}
            className="border p-2 rounded-md"
            required
          />
          <button 
            type="submit" 
            className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Agregando...' : 'Agregar'}
          </button>
        </div>
      </form>

      <h2 className="text-xl mb-3 font-semibold">Equipo Actual</h2>
      {loading ? (<p>Cargando...</p>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              {/* CORRECCIÓN: Nos aseguramos que no haya espacios/saltos de línea aquí */}
              <tr>
                <th className="py-2 px-4 border-b text-left">Nombre</th>
                <th className="py-2 px-4 border-b text-left">Puesto</th>
                <th className="py-2 px-4 border-b text-left">Local</th>
                <th className="py-2 px-4 border-b text-left">Acciones</th>
              </tr>
            </thead>
            {/* CORRECCIÓN: Nos aseguramos que no haya espacios/saltos de línea aquí */}
            <tbody>{colaboradores.map((colaborador) => (
                <tr key={colaborador.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{colaborador.nombre}</td>
                  <td className="py-2 px-4 border-b">{colaborador.puesto}</td>
                  <td className="py-2 px-4 border-b">{colaborador.local}</td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      onClick={() => handleDeleteColaborador(colaborador.id)}
                      className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}