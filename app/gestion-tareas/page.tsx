'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface Tarea {
  id: string;
  nombre: string;
  descripcion: string;
  puestoAsignado: string;
}

export default function GestionTareasPage() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [nuevaTarea, setNuevaTarea] = useState({
    nombre: '',
    descripcion: '',
    puestoAsignado: 'Todos',
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar las tareas existentes
  const fetchTareas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tareas"));
      const tareasList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tarea[];
      setTareas(tareasList);
    } catch (error) {
      console.error("Error al cargar tareas: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  // Agregar una nueva tarea
  const handleAddTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (nuevaTarea.nombre && nuevaTarea.puestoAsignado) {
      setIsSubmitting(true);
      try {
        await addDoc(collection(db, "tareas"), nuevaTarea);
        setNuevaTarea({ nombre: '', descripcion: '', puestoAsignado: 'Todos' });
        fetchTareas();
      } catch (error) {
        console.error("Error al agregar tarea: ", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Eliminar una tarea
  const handleDeleteTarea = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await deleteDoc(doc(db, "tareas", id));
        setTareas(tareas.filter(t => t.id !== id));
      } catch (error) {
        console.error("Error al eliminar tarea: ", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tareas y KPIs</h1>
      
      <form onSubmit={handleAddTarea} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl mb-3 font-semibold">Crear Nueva Tarea</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Nombre de la tarea (ej: Limpiar mesas)"
            value={nuevaTarea.nombre}
            onChange={(e) => setNuevaTarea({ ...nuevaTarea, nombre: e.target.value })}
            className="border p-2 rounded-md w-full md:w-auto"
            required
          />
          <input
            type="text"
            placeholder="Descripción (opcional)"
            value={nuevaTarea.descripcion}
            onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
            className="border p-2 rounded-md w-full md:w-auto"
          />
          <select
            value={nuevaTarea.puestoAsignado}
            onChange={(e) => setNuevaTarea({ ...nuevaTarea, puestoAsignado: e.target.value })}
            className="border p-2 rounded-md"
          >
            <option value="Todos">Todos</option>
            <option value="Mesero">Mesero</option>
            <option value="Cocina">Cocina</option>
            <option value="Caja">Caja</option>
          </select>
          <button 
            type="submit" 
            className="bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creando...' : 'Crear Tarea'}
          </button>
        </div>
      </form>

      <h2 className="text-xl mb-3 font-semibold">Lista de Tareas</h2>
      {loading ? (<p>Cargando...</p>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b text-left">Nombre</th>
                <th className="py-2 px-4 border-b text-left">Descripción</th>
                <th className="py-2 px-4 border-b text-left">Asignado a</th>
                <th className="py-2 px-4 border-b text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tareas.map((tarea) => (
                <tr key={tarea.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{tarea.nombre}</td>
                  <td className="py-2 px-4 border-b">{tarea.descripcion}</td>
                  <td className="py-2 px-4 border-b">{tarea.puestoAsignado}</td>
                  <td className="py-2 px-4 border-b">
                    <button 
                      onClick={() => handleDeleteTarea(tarea.id)}
                      className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}