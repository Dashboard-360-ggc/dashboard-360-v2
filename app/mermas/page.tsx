'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

// Añadimos 'costo' a la estructura
interface Merma {
  id: string;
  productoNombre: string;
  cantidad: number;
  unidad: string;
  motivo: string;
  costo: number; // <-- NUEVO CAMPO
  fecha: string;
}

export default function MermasPage() {
  const [mermas, setMermas] = useState<Merma[]>([]);
  const [nuevaMerma, setNuevaMerma] = useState({
    productoNombre: '',
    cantidad: 0,
    unidad: '',
    motivo: '',
    costo: 0, // <-- NUEVO CAMPO
  });
  const [loading, setLoading] = useState(true);

  const fetchMermas = async () => {
    try {
      const q = query(collection(db, "mermas"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const mermasList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          productoNombre: data.productoNombre,
          cantidad: data.cantidad,
          unidad: data.unidad,
          motivo: data.motivo,
          costo: data.costo, // <-- NUEVO CAMPO
          fecha: data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString() : 'Fecha no disponible',
        } as Merma;
      });
      setMermas(mermasList);
    } catch (error) {
      console.error("Error al cargar mermas: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMermas();
  }, []);

  const handleAddMerma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaMerma.productoNombre && nuevaMerma.cantidad > 0 && nuevaMerma.unidad && nuevaMerma.motivo && nuevaMerma.costo >= 0) {
      try {
        await addDoc(collection(db, "mermas"), {
          ...nuevaMerma,
          timestamp: serverTimestamp(),
        });
        setNuevaMerma({ productoNombre: '', cantidad: 0, unidad: '', motivo: '', costo: 0 });
        fetchMermas();
      } catch (error) {
        console.error("Error al agregar merma: ", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Registro de Mermas</h1>
      
      <form onSubmit={handleAddMerma} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl mb-3 font-semibold">Agregar Nueva Merma</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* ... otros inputs ... */}
          <input
            type="number"
            step="0.01"
            placeholder="Costo total de la merma"
            value={nuevaMerma.costo}
            onChange={(e) => setNuevaMerma({ ...nuevaMerma, costo: Number(e.target.value) })}
            className="border p-2 rounded-md"
            required
          />
          <button type="submit" className="bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700">
            Registrar
          </button>
        </div>
      </form>

      {/* La tabla ahora mostrará el costo */}
      <h2 className="text-xl mb-3 font-semibold">Historial de Mermas</h2>
      {loading ? (<p>Cargando...</p>) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b text-left">Producto</th>
                <th className="py-2 px-4 border-b text-left">Cantidad</th>
                <th className="py-2 px-4 border-b text-left">Motivo</th>
                <th className="py-2 px-4 border-b text-left">Costo</th>
                <th className="py-2 px-4 border-b text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {mermas.map((merma) => (
                <tr key={merma.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{merma.productoNombre}</td>
                  <td className="py-2 px-4 border-b">{merma.cantidad} {merma.unidad}</td>
                  <td className="py-2 px-4 border-b">{merma.motivo}</td>
                  <td className="py-2 px-4 border-b text-red-600 font-medium">${merma.costo.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">{merma.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}