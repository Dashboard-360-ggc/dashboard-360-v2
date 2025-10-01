'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp, query, where, Timestamp } from 'firebase/firestore';

// Interfaces
interface Colaborador {
  id: string;
  nombre: string;
  puesto: string;
}

interface Tarea {
  id: string;
  nombre: string;
  puestoAsignado: string;
}

interface TareaCompletada {
    id: string;
    tareaNombre: string;
    colaboradorNombre: string;
    fecha: string;
}

export default function MisTareasPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [tareasCompletadas, setTareasCompletadas] = useState<TareaCompletada[]>([]);
  
  const [selectedColaboradorId, setSelectedColaboradorId] = useState('');
  const [loading, setLoading] = useState(true);

  // Cargar todos los datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar colaboradores
        const colSnapshot = await getDocs(collection(db, "colaboradores"));
        const colList = colSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Colaborador[];
        setColaboradores(colList);
        if (colList.length > 0) {
          setSelectedColaboradorId(colList[0].id);
        }

        // Cargar todas las tareas maestras
        const tareasSnapshot = await getDocs(collection(db, "tareas"));
        const tareasList = tareasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tarea[];
        setTareas(tareasList);

      } catch (error) {
        console.error("Error al cargar datos iniciales: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  // Marcar una tarea como completada
  const handleCompletarTarea = async (tarea: Tarea) => {
    const colaborador = colaboradores.find(c => c.id === selectedColaboradorId);
    if (!colaborador) return;

    try {
      await addDoc(collection(db, "tareasCompletadas"), {
        tareaId: tarea.id,
        tareaNombre: tarea.nombre,
        colaboradorId: colaborador.id,
        colaboradorNombre: colaborador.nombre,
        timestamp: serverTimestamp(),
      });
      alert(`¡Tarea "${tarea.nombre}" completada por ${colaborador.nombre}!`);
      // Opcional: recargar la lista de tareas completadas para verla al instante
    } catch (error) {
      console.error("Error al completar la tarea: ", error);
    }
  };

  // Filtrar tareas para el colaborador seleccionado
  const selectedColaborador = colaboradores.find(c => c.id === selectedColaboradorId);
  const tareasParaMostrar = tareas.filter(tarea => 
    tarea.puestoAsignado === 'Todos' || tarea.puestoAsignado === selectedColaborador?.puesto
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Mis Tareas Diarias</h1>
      
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <label htmlFor="colaborador-select" className="block text-lg font-semibold mb-2">¿Quién eres?</label>
        <select
          id="colaborador-select"
          value={selectedColaboradorId}
          onChange={(e) => setSelectedColaboradorId(e.target.value)}
          className="border p-2 rounded-md w-full md:w-1/3"
        >
          {colaboradores.map(col => (
            <option key={col.id} value={col.id}>{col.nombre}</option>
          ))}
        </select>
      </div>

      <h2 className="text-xl mb-3 font-semibold">Tareas Pendientes para {selectedColaborador?.nombre}</h2>
      {loading ? (<p>Cargando tareas...</p>) : (
        <div className="bg-white p-4 rounded-lg shadow">
          <ul className="space-y-3">
            {tareasParaMostrar.map((tarea) => (
              <li key={tarea.id} className="flex justify-between items-center p-3 rounded hover:bg-gray-50 border">
                <div>
                  <p className="font-medium">{tarea.nombre}</p>
                  <p className="text-sm text-gray-500">{tarea.puestoAsignado}</p>
                </div>
                <button 
                  onClick={() => handleCompletarTarea(tarea)}
                  className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700"
                >
                  Completar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}