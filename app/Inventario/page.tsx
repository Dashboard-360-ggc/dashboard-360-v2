'use client';

import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Interfaz para definir el tipo de dato de un producto
interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  unidad: string;
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', cantidad: 0, unidad: '' });
  const [loading, setLoading] = useState(true);

  // Función para cargar los productos desde Firestore
  const fetchProductos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inventario"));
      const productosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Producto[];
      setProductos(productosList);
    } catch (error) {
      console.error("Error al cargar productos: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos solo una vez, cuando el componente se monta
  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para manejar el envío del formulario y agregar un nuevo producto
  const handleAddProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevoProducto.nombre && nuevoProducto.cantidad > 0 && nuevoProducto.unidad) {
      try {
        await addDoc(collection(db, "inventario"), {
          ...nuevoProducto,
          fechaUltimaActualizacion: serverTimestamp(),
        });
        setNuevoProducto({ nombre: '', cantidad: 0, unidad: '' }); // Limpiar formulario
        fetchProductos(); // Volver a cargar la lista de productos actualizada
      } catch (error) {
        console.error("Error al agregar producto: ", error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestión de Inventario</h1>
      
      {/* Formulario para agregar nuevos productos */}
      <form onSubmit={handleAddProducto} className="mb-6 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl mb-3 font-semibold">Agregar Nuevo Producto</h2>
        <div className="flex flex-wrap items-center gap-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={nuevoProducto.cantidad}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: Number(e.target.value) })}
            className="border p-2 rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Unidad (kg, lt, pz)"
            value={nuevoProducto.unidad}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, unidad: e.target.value })}
            className="border p-2 rounded-md"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Agregar
          </button>
        </div>
      </form>

      {/* Tabla para mostrar el inventario actual */}
      <h2 className="text-xl mb-3 font-semibold">Inventario Actual</h2>
      {loading ? (
        <p>Cargando productos...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border-b text-left">Nombre</th>
                <th className="py-2 px-4 border-b text-left">Cantidad</th>
                <th className="py-2 px-4 border-b text-left">Unidad</th>
              </tr>
            </thead>
            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{producto.nombre}</td>
                    <td className="py-2 px-4 border-b">{producto.cantidad}</td>
                    <td className="py-2 px-4 border-b">{producto.unidad}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No hay productos en el inventario.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}