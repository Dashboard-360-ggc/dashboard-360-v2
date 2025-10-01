'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';

// Interfaces para los datos que vamos a manejar
interface Colaborador {
  id: string;
  nombre: string;
}

interface DesempenoColaborador {
  nombre: string;
  ventasDelDia: number;
  tareasCompletadas: number;
  idd: number; // Índice de Desempeño Diario
}

export default function DesempenoPage() {
  const [desempeno, setDesempeno] = useState<DesempenoColaborador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calcularDesempeno = async () => {
      try {
        // --- Paso 1: Obtener todos los datos necesarios ---
        const colaboradoresSnapshot = await getDocs(collection(db, "colaboradores"));
        const colaboradores = colaboradoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Colaborador[];

        // Crear los límites para "hoy"
        const hoyInicio = new Date();
        hoyInicio.setHours(0, 0, 0, 0);
        const hoyFin = new Date();
        hoyFin.setHours(23, 59, 59, 999);

        // Obtener ventas, tareas y asistencia de HOY
        const ventasQuery = query(collection(db, "ventas"), where("timestamp", ">=", hoyInicio), where("timestamp", "<=", hoyFin));
        const tareasQuery = query(collection(db, "tareasCompletadas"), where("timestamp", ">=", hoyInicio), where("timestamp", "<=", hoyFin));
        
        const [ventasSnapshot, tareasSnapshot] = await Promise.all([
          getDocs(ventasQuery),
          getDocs(tareasQuery)
        ]);
        
        const ventasDeHoy = ventasSnapshot.docs.map(doc => doc.data());
        const tareasDeHoy = tareasSnapshot.docs.map(doc => doc.data());

        // --- Paso 2: Procesar y calcular el desempeño para cada colaborador ---
        const desempenoCalculado = colaboradores.map(col => {
          // Calcular ventas del día por colaborador
          const ventasDelDia = ventasDeHoy
            .filter(venta => venta.atendidoPor === col.nombre)
            .reduce((sum, venta) => sum + venta.total, 0);

          // Contar tareas completadas por colaborador
          const tareasCompletadas = tareasDeHoy.filter(tarea => tarea.colaboradorNombre === col.nombre).length;

          // --- Paso 3: Calcular el Índice de Desempeño Diario (IDD) ---
          // Esta es una fórmula simple, puedes ajustarla como quieras.
          // Aquí, cada venta suma 1 punto y cada tarea completada suma 10 puntos.
          const puntajeVentas = ventasDelDia; // 1 dólar = 1 punto
          const puntajeTareas = tareasCompletadas * 10; // 1 tarea = 10 puntos
          const idd = puntajeVentas + puntajeTareas;

          return {
            nombre: col.nombre,
            ventasDelDia,
            tareasCompletadas,
            idd,
          };
        });

        // Ordenar por IDD de mayor a menor
        desempenoCalculado.sort((a, b) => b.idd - a.idd);

        setDesempeno(desempenoCalculado);

      } catch (error) {
        console.error("Error al calcular desempeño: ", error);
      } finally {
        setLoading(false);
      }
    };

    calcularDesempeno();
  }, []);

  // Función para determinar el color del semáforo según el IDD
  const getSemaforoColor = (idd: number) => {
    if (idd > 100) return 'bg-green-500 text-white'; // Verde para alto desempeño
    if (idd > 50) return 'bg-yellow-400 text-black'; // Amarillo para desempeño medio
    return 'bg-red-500 text-white'; // Rojo para bajo desempeño
  };

  if (loading) {
    return <div className="p-8"><h2>Calculando desempeño diario...</h2></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Desempeño Diario</h1>
      
      <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border-b text-left">Ranking</th>
              <th className="py-2 px-4 border-b text-left">Colaborador</th>
              <th className="py-2 px-4 border-b text-left">Ventas del Día</th>
              <th className="py-2 px-4 border-b text-left">Tareas Completadas</th>
              <th className="py-2 px-4 border-b text-center">Índice (IDD)</th>
            </tr>
          </thead>
          <tbody>
            {desempeno.map((col, index) => (
              <tr key={col.nombre} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b font-medium">{index + 1}</td>
                <td className="py-3 px-4 border-b">{col.nombre}</td>
                <td className="py-3 px-4 border-b">${col.ventasDelDia.toFixed(2)}</td>
                <td className="py-3 px-4 border-b">{col.tareasCompletadas}</td>
                <td className="py-3 px-4 border-b text-center">
                  <span className={`px-3 py-1 rounded-full font-bold ${getSemaforoColor(col.idd)}`}>
                    {col.idd.toFixed(0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}