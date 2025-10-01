'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';

// Interfaz para Colaborador (para el dropdown)
interface Colaborador {
  id: string;
  nombre: string;
}

// Interfaz para el registro de asistencia
interface RegistroAsistencia {
    id: string;
    colaboradorNombre: string;
    tipo: 'Entrada' | 'Salida';
    fecha: string;
}

export default function AsistenciaPage() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [selectedColaborador, setSelectedColaborador] = useState('');
  const [registros, setRegistros] = useState<RegistroAsistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar colaboradores y registros recientes
  const fetchData = async () => {
    try {
      // Cargar colaboradores para el dropdown
      const colSnapshot = await getDocs(collection(db, "colaboradores"));
      const colList = colSnapshot.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre })) as Colaborador[];
      setColaboradores(colList);
      if (colList.length > 0) {
        setSelectedColaborador(colList[0].id); // Seleccionar el primero por defecto
      }

      // Cargar los últimos 10 registros de asistencia
      const regQuery = query(collection(db, "asistencia"), orderBy("timestamp", "desc"), limit(10));
      const regSnapshot = await getDocs(regQuery);
      const regList = regSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          colaboradorNombre: data.colaboradorNombre,
          tipo: data.tipo,
          fecha: data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A',
        } as RegistroAsistencia;
      });
      setRegistros(regList);

    } catch (error) {
      console.error("Error al cargar datos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para registrar un evento (Entrada o Salida)
  const handleRegistrarEvento = async (tipo: 'Entrada' | 'Salida') => {
    if (!selectedColaborador) {
      alert("Por favor, selecciona un colaborador.");
      return;
    }
    setIsSubmitting(true);
    try {
      const colaborador = colaboradores.find(c => c.id === selectedColaborador);
      await addDoc(collection(db, "asistencia"), {
        colaboradorId: selectedColaborador,
        colaboradorNombre: colaborador?.nombre,
        tipo: tipo,
        timestamp: serverTimestamp(),
      });
      fetchData(); // Recargar los datos
    } catch (error) {
      console.error("Error al registrar evento: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Registro de Asistencia</h1>
      
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl mb-3 font-semibold">Registrar Evento</h2>
        <div className="flex flex-wrap items-center gap-4">
          <select
            value={selectedColaborador}
            onChange={(e) => setSelectedColaborador(e.target.value)}
            className="border p-2 rounded-md"
            disabled={loading || isSubmitting}
          >
            {colaboradores.map(col => (
              <option key={col.id} value={col.id}>{col.nombre}</option>
            ))}
          </select>
          
          <button 
            onClick={() => handleRegistrarEvento('Entrada')}
            disabled={isSubmitting}
            className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Entrada'}
          </button>
          <button 
            onClick={() => handleRegistrarEvento('Salida')}
            disabled={isSubmitting}
            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Salida'}
          </button>
        </div>
      </div>

      <h2 className="text-xl mb-3 font-semibold">Últimos Registros</h2>
      {loading ? (<p>Cargando...</p>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b text-left">Colaborador</th>
                <th className="py-2 px-4 border-b text-left">Evento</th>
                <th className="py-2 px-4 border-b text-left">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((registro) => (
                <tr key={registro.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{registro.colaboradorNombre}</td>
                  <td className={`py-2 px-4 border-b font-medium ${registro.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {registro.tipo}
                  </td>
                  <td className="py-2 px-4 border-b">{registro.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}