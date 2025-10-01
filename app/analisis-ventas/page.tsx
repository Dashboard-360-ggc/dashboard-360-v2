'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import * as XLSX from 'xlsx';

// Interfaces
interface Venta {
  id: string;
  total: number;
  atendidoPor: string;
  timestamp: Timestamp;
}
interface Stats {
  totalVentas: number;
  numeroVentas: number;
  ticketPromedio: number;
  rankingVendedores: { nombre: string; total: number }[];
}

export default function AnalisisVentasPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const fetchAndCalculateStats = async (inicio: Date | null, fin: Date | null) => {
    setLoading(true);
    try {
      const ventasCollection = collection(db, "ventas");
      let ventasQuery = (inicio && fin)
        ? query(ventasCollection, where("timestamp", ">=", inicio), where("timestamp", "<=", fin))
        : query(ventasCollection);
      
      const querySnapshot = await getDocs(ventasQuery);
      const ventasData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Venta[];
      
      const totalVentas = ventasData.reduce((sum, venta) => sum + venta.total, 0);
      const numeroVentas = ventasData.length;
      const ticketPromedio = numeroVentas > 0 ? totalVentas / numeroVentas : 0;
      
      const ventasPorVendedor: { [key: string]: number } = {};
      ventasData.forEach(venta => {
        ventasPorVendedor[venta.atendidoPor] = (ventasPorVendedor[venta.atendidoPor] || 0) + venta.total;
      });
      
      const rankingVendedores = Object.entries(ventasPorVendedor)
        .map(([nombre, total]) => ({ nombre, total }))
        .sort((a, b) => b.total - a.total);
        
      setStats({ totalVentas, numeroVentas, ticketPromedio, rankingVendedores });
    } catch (error) {
      console.error("Error al calcular estadísticas: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndCalculateStats(null, null);
  }, []);

  const handleFiltrar = () => {
    if (fechaInicio && fechaFin) {
      const inicioDate = new Date(fechaInicio);
      const finDate = new Date(fechaFin);
      finDate.setHours(23, 59, 59, 999);
      fetchAndCalculateStats(inicioDate, finDate);
    }
  };
  
  const handleExport = () => {
    if (!stats || !stats.rankingVendedores || stats.rankingVendedores.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }
    const dataParaExportar = stats.rankingVendedores.map((vendedor, index) => ({
      'Ranking': index + 1,
      'Vendedor': vendedor.nombre,
      'Total Vendido ($)': vendedor.total.toFixed(2),
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataParaExportar);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ranking de Ventas");
    XLSX.writeFile(workbook, "ReporteDeVentas.xlsx");
  };
  
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Panel de Análisis de Ventas</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          Exportar a Excel
        </button>
      </div>
      
      <div className="mb-6 p-4 border rounded-lg bg-gray-50 flex flex-wrap items-center gap-4">
        <div>
          <label htmlFor="fecha-inicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
          <input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className="border p-2 rounded-md" />
        </div>
        <div>
          <label htmlFor="fecha-fin" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
          <input type="date" id="fecha-fin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className="border p-2 rounded-md" />
        </div>
        <button onClick={handleFiltrar} className="bg-blue-600 text-white p-2 rounded-md self-end hover:bg-blue-700">
          Filtrar
        </button>
      </div>

      {loading ? (<p>Cargando...</p>) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500">Ventas Totales (Filtrado)</h3>
              <p className="text-3xl font-bold">${stats?.totalVentas.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500">Número de Ventas</h3>
              <p className="text-3xl font-bold">{stats?.numeroVentas}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-gray-500">Ticket Promedio</h3>
              <p className="text-3xl font-bold">${stats?.ticketPromedio.toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Ranking de Vendedores</h2>
            <div className="bg-white p-4 rounded-lg shadow">
              <ul className="space-y-3">
                {stats?.rankingVendedores.map((vendedor, index) => (
                  <li key={vendedor.nombre} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                    <span className="font-medium">{index + 1}. {vendedor.nombre}</span>
                    <span className="font-bold text-green-600">${vendedor.total.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}