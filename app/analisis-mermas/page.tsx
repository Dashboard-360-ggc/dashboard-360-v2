'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

interface Merma {
  costo: number;
}

interface Venta {
  total: number;
}

interface Stats {
  costoTotalMermas: number;
  totalVentas: number;
  porcentajePerdida: number;
}

export default function AnalisisMermasPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      try {
        // 1. Obtener todas las mermas y sumar su costo
        const mermasSnapshot = await getDocs(collection(db, "mermas"));
        const mermasData = mermasSnapshot.docs.map(doc => doc.data() as Merma);
        const costoTotalMermas = mermasData.reduce((sum, merma) => sum + merma.costo, 0);

        // 2. Obtener todas las ventas y sumar el total
        const ventasSnapshot = await getDocs(collection(db, "ventas"));
        const ventasData = ventasSnapshot.docs.map(doc => doc.data() as Venta);
        const totalVentas = ventasData.reduce((sum, venta) => sum + venta.total, 0);

        // 3. Calcular el porcentaje de pérdida
        const porcentajePerdida = totalVentas > 0 ? (costoTotalMermas / totalVentas) * 100 : 0;

        setStats({ costoTotalMermas, totalVentas, porcentajePerdida });

      } catch (error) {
        console.error("Error al calcular estadísticas de mermas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStats();
  }, []);

  if (loading) {
    return <div className="p-8"><h2>Cargando estadísticas...</h2></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Análisis de Mermas y Desperdicios</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Costo Total de Mermas</h3>
          <p className="text-3xl font-bold text-red-600">${stats?.costoTotalMermas.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">% de Pérdidas sobre Ventas</h3>
          <p className="text-3xl font-bold">{stats?.porcentajePerdida.toFixed(2)}%</p>
          <p className="text-sm text-gray-400">Basado en ventas totales de ${stats?.totalVentas.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}