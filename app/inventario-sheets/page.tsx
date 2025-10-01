'use client';

import { useState } from 'react';

export default function InventarioSheetsPage() {
  const [data, setData] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDataFromSheet = async () => {
    setLoading(true);
    setError(null);
    try {
      // Esta es la línea clave: llamamos a nuestra propia API
      const response = await fetch('/api/sheets'); 
      
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      const result = await response.json();
      setData(result.rows || []);
    } catch (err) {
      setError('No se pudieron cargar los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Inventario desde Google Sheets</h1>
      <button 
        onClick={fetchDataFromSheet} 
        disabled={loading} 
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg disabled:bg-gray-400 hover:bg-green-700"
      >
        {loading ? 'Cargando...' : 'Cargar Inventario'}
      </button>

      {error && <p className="mt-4 text-red-600">{error}</p>}

      <div className="mt-6">
        <table className="min-w-full bg-white border">
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">{cell}</td>
                  ))}
                </tr>
              ))
            ) : (
              !loading && <tr><td colSpan={10} className="text-center p-4 text-gray-500">No hay datos para mostrar.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}