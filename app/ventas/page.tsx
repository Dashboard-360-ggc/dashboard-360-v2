'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Interfaz para Colaborador (la usaremos para el dropdown)
interface Colaborador {
  id: string;
  nombre: string;
}

// Interfaz para Venta
interface Venta {
  id: string;
  total: number;
  metodoPago: string;
  atendidoPor: string;
  fecha: string; 
}

export default function VentasPage() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]); // <-- NUEVO ESTADO
  const [nuevaVenta, setNuevaVenta] = useState({
    total: 0,
    metodoPago: 'Efectivo',
    atendidoPor: '', // <-- Se llenará desde el dropdown
  });
  const [loading, setLoading] = useState(true);

  // Función unificada para cargar todos los datos necesarios
  const fetchData = async () => {
    try {
      // Cargar colaboradores para el dropdown
      const colSnapshot = await getDocs(collection(db, "colaboradores"));
      const colList = colSnapshot.docs.map(doc => ({ id: doc.id, nombre: doc.data().nombre })) as Colaborador[];
      setColaboradores(colList);
      if (colList.length > 0) {
        setNuevaVenta(prev => ({ ...prev, atendidoPor: colList[0].nombre }));
      }

      // Cargar ventas
      const venQuery = query(collection(db, "ventas"), orderBy("timestamp", "desc"));
      const venSnapshot = await getDocs(venQuery);
      const venList = venSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          total: data.total,
          metodoPago: data.metodoPago,
          atendidoPor: data.atendidoPor,
          fecha: data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'N/A',
        } as Venta;
      });
      setVentas(venList);

    } catch (error) {
      console.error("Error al cargar datos: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVenta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaVenta.total > 0 && nuevaVenta.atendidoPor) {
      try {
        await addDoc(collection(db, "ventas"), { ...nuevaVenta, timestamp: serverTimestamp() });
        setNuevaVenta({ total: 0, metodoPago: 'Efectivo', atendidoPor: colaboradores.length > 0 ? colaboradores[0].nombre : '' });
        fetchData(); // Recargar todo
      } catch (error) {
        console.error("Error al agregar venta: ", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Registro de Ventas</h1>
      
      <form onSubmit={handleAddVenta} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl mb-3 font-semibold">Agregar Nueva Venta</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="number"
            placeholder="Total de la venta"
            step="0.01"
            value={nuevaVenta.total}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, total: Number(e.target.value) })}
            className="border p-2 rounded-md"
            required
          />
          <select
            value={nuevaVenta.metodoPago}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, metodoPago: e.target.value })}
            className="border p-2 rounded-md"
          >
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
          
          {/* AHORA ES UN MENÚ DESPLEGABLE */}
          <select
            value={nuevaVenta.atendidoPor}
            onChange={(e) => setNuevaVenta({ ...nuevaVenta, atendidoPor: e.target.value })}
            className="border p-2 rounded-md"
            required
          >
            <option value="" disabled>Selecciona un colaborador</option>
            {colaboradores.map(col => (
              <option key={col.id} value={col.nombre}>{col.nombre}</option>
            ))}
          </select>

          <button type="submit" className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700">
            Registrar Venta
          </button>
        </div>
      </form>

      {/* La tabla sigue igual */}
      <h2 className="text-xl mb-3 font-semibold">Historial de Ventas</h2>
      {/* ... (el resto del código de la tabla es igual que antes) ... */}
    </div>
  );
}