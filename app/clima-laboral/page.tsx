'use client';

import React, { useState, useEffect } from 'react';

interface Respuesta {
  timestamp: string;
  satisfaccion: number;
  fortalezas: string;
  mejoras: string;
}

interface Stats {
  numeroRespuestas: number;
  satisfaccionPromedio: number;
}

export default function ClimaLaboralPage() {
  const [respuestas, setRespuestas] = useState<Respuesta[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/clima');
        const result = await response.json();
        
        const dataProcesada: Respuesta[] = result.rows.map((row: any) => ({
          timestamp: row[0],
          satisfaccion: Number(row[1]), // La columna 2 es la de satisfacción
          fortalezas: row[2],      // La columna 3 es fortalezas
          mejoras: row[3],         // La columna 4 es mejoras
        }));
        setRespuestas(dataProcesada);

        // Calcular estadísticas
        const numeroRespuestas = dataProcesada.length;
        const satisfaccionTotal = dataProcesada.reduce((sum, res) => sum + res.satisfaccion, 0);
        const satisfaccionPromedio = numeroRespuestas > 0 ? satisfaccionTotal / numeroRespuestas : 0;
        setStats({ numeroRespuestas, satisfaccionPromedio });

      } catch (error) {
        console.error("Error al cargar datos de clima: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8"><h2>Cargando datos del clima laboral...</h2></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Clima Laboral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Número de Respuestas</h3>
          <p className="text-3xl font-bold">{stats?.numeroRespuestas}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Satisfacción Promedio (1-5)</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.satisfaccionPromedio.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Comentarios Recientes</h2>
      <div className="space-y-4">
        {respuestas.map((res, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{new Date(res.timestamp).toLocaleString()}</p>
            <p className="mt-2"><strong className="text-green-600">Fortalezas:</strong> {res.fortalezas}</p>
            <p className="mt-1"><strong className="text-orange-600">Áreas de Mejora:</strong> {res.mejoras}</p>
          </div>
        ))}
      </div>
    </div>
  );
}