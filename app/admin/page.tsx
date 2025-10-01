'use client';

import React, { useState } from 'react';

export default function AdminPage() {
  const [uid, setUid] = useState('');
  const [role, setRole] = useState('editor');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }
      setMessage(data.message);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración de Roles</h1>

      <form onSubmit={handleSetRole} className="p-4 border rounded-lg bg-gray-50 max-w-md">
        <h2 className="text-xl mb-3 font-semibold">Asignar Rol a Usuario</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-gray-700">UID del Usuario</label>
            <input
              type="text"
              id="uid"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              className="border p-2 rounded-md w-full"
              placeholder="Pega aquí el UID del usuario de Firebase"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Seleccionar Rol</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border p-2 rounded-md w-full"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Lector (Solo ver)</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 disabled:bg-gray-400 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Asignando...' : 'Asignar Rol'}
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${message.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
    </div>
  );
}